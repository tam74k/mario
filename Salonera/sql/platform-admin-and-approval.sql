-- =======================================================
-- Platform Admin + Salon Approval + Trial start
-- =======================================================

-- 1) Salon account status + timestamps
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'salon_account_status') THEN
    CREATE TYPE public.salon_account_status AS ENUM ('pending','active','disabled');
  END IF;
END$$;

ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS account_status public.salon_account_status NOT NULL DEFAULT 'pending';
ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS disabled_at timestamptz;

-- (optional) Images
ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.specialists ADD COLUMN IF NOT EXISTS image_url text;

-- 2) Platform admins table
CREATE TABLE IF NOT EXISTS public.platform_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS(SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid());
$$;

DROP POLICY IF EXISTS "platform_admins_self_read" ON public.platform_admins;
CREATE POLICY "platform_admins_self_read"
ON public.platform_admins FOR SELECT
USING (user_id = auth.uid());

-- 3) Allow platform admin to read/update salons & read customers
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "salons_platform_admin_read" ON public.salons;
CREATE POLICY "salons_platform_admin_read"
ON public.salons FOR SELECT
USING (public.is_platform_admin());

DROP POLICY IF EXISTS "salons_platform_admin_update" ON public.salons;
CREATE POLICY "salons_platform_admin_update"
ON public.salons FOR UPDATE
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customers_platform_admin_read" ON public.customers;
CREATE POLICY "customers_platform_admin_read"
ON public.customers FOR SELECT
USING (public.is_platform_admin());

-- 4) Trial plan + subscription start on approval
-- Assumes tables: public.plans(code unique, id, trial_days, limits_json, ...)
-- and public.salon_subscriptions(salon_id unique, plan_id, status, starts_at, ends_at)

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='plans') THEN
    INSERT INTO public.plans (code, name, billing_period, limits_json, is_trial, trial_days)
    VALUES ('trial_limited', 'تجربة محدودة', 'trial', '{"bookings_per_month":10,"staff_limit":5,"services_limit":10}'::jsonb, true, 14)
    ON CONFLICT (code) DO UPDATE SET
      name=EXCLUDED.name,
      limits_json=EXCLUDED.limits_json,
      is_trial=EXCLUDED.is_trial,
      trial_days=EXCLUDED.trial_days;
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.approve_salon(p_salon_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_id uuid;
  v_days int;
BEGIN
  IF NOT public.is_platform_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  UPDATE public.salons
  SET account_status='active', approved_at=now(), disabled_at=NULL
  WHERE id=p_salon_id;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='plans')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='salon_subscriptions')
  THEN
    SELECT id, COALESCE(trial_days, 14) INTO v_plan_id, v_days
    FROM public.plans
    WHERE code='trial_limited'
    LIMIT 1;

    IF v_plan_id IS NULL THEN
      RETURN;
    END IF;

    INSERT INTO public.salon_subscriptions (salon_id, plan_id, status, starts_at, ends_at)
    VALUES (p_salon_id, v_plan_id, 'trialing', now(), now() + make_interval(days => v_days))
    ON CONFLICT (salon_id) DO UPDATE SET
      plan_id=EXCLUDED.plan_id,
      status=EXCLUDED.status,
      starts_at=EXCLUDED.starts_at,
      ends_at=EXCLUDED.ends_at;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.disable_salon(p_salon_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.is_platform_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  UPDATE public.salons
  SET account_status='disabled', disabled_at=now()
  WHERE id=p_salon_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_salon(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.disable_salon(uuid) TO authenticated;

-- 5) Recommended helper for RLS
CREATE OR REPLACE FUNCTION public.is_salon_active(p_salon_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS(SELECT 1 FROM public.salons WHERE id=p_salon_id AND account_status='active');
$$;

-- Add to your existing RLS for salon data (services/bookings/etc):
-- using (is_staff_of_salon(salon_id) AND is_salon_active(salon_id))
