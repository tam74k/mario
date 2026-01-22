export function toast(msg, type="info"){
  const el = document.querySelector(".toast");
  if (!el) return alert(msg);
  el.innerHTML = `<div style="font-weight:800;margin-bottom:4px">${type === "error" ? "خطأ" : "تنبيه"}</div>
                  <div class="small muted">${escapeHtml(String(msg))}</div>`;
  el.classList.add("show");
  setTimeout(()=> el.classList.remove("show"), 3200);
}

export function qs(sel){ return document.querySelector(sel); }
export function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

export function fmtDateTime(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleString("ar-EG", { year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit" });
  }catch{ return iso; }
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
