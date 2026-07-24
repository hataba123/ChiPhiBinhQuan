"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type DurationUnit = "months" | "years";
type Item = { id: number; name: string; price: number; months: number; category: string };

const initialItems: Item[] = [
  { id: 1, name: "Máy giặt cửa trước", price: 12500000, months: 96, category: "Gia dụng" },
  { id: 2, name: "Tủ lạnh Inverter", price: 9800000, months: 120, category: "Gia dụng" },
  { id: 3, name: "Laptop làm việc", price: 22000000, months: 60, category: "Công nghệ" },
  { id: 4, name: "Điện thoại", price: 14500000, months: 48, category: "Công nghệ" },
];

const itemsStorageKey = "chi-phi-binh-quan-items";
const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("vi-VN");
const emptyForm = { name: "", price: "", duration: "", durationUnit: "years" as DurationUnit, category: "Khác" };

function formatDuration(months: number) {
  return months % 12 === 0 ? `${number.format(months / 12)} năm` : `${number.format(months)} tháng`;
}

function getInitialItems() {
  if (typeof window === "undefined") return initialItems;

  try {
    const storedItems = window.localStorage.getItem(itemsStorageKey);
    const parsedItems = storedItems ? JSON.parse(storedItems) : null;
    return Array.isArray(parsedItems) ? parsedItems as Item[] : initialItems;
  } catch {
    return initialItems;
  }
}

export default function Home() {
  const [items, setItems] = useState<Item[]>(getInitialItems);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    try { window.localStorage.setItem(itemsStorageKey, JSON.stringify(items)); } catch {
      // Không làm gián đoạn thao tác nếu không thể lưu trên trình duyệt.
    }
  }, [items]);

  const summary = useMemo(() => {
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    const yearlyCost = items.reduce((sum, item) => sum + item.price / (item.months / 12), 0);
    return { totalValue, yearlyCost, monthlyCost: yearlyCost / 12 };
  }, [items]);

  function openAddForm() { setForm(emptyForm); setEditingId(null); setShowForm(true); }
  function cancelForm() { setForm(emptyForm); setEditingId(null); setShowForm(false); }
  function startEdit(item: Item) {
    const useYears = item.months % 12 === 0;
    setForm({ name: item.name, price: String(item.price), duration: String(useYears ? item.months / 12 : item.months), durationUnit: useYears ? "years" : "months", category: item.category });
    setEditingId(item.id);
    setShowForm(true);
  }
  function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(form.price);
    const durationValue = Number(form.duration);
    const months = form.durationUnit === "years" ? Math.round(durationValue * 12) : Math.round(durationValue);
    if (!form.name.trim() || price <= 0 || months <= 0) return;
    const nextItem = { name: form.name.trim(), price, months, category: form.category.trim() || "Khác" };
    setItems((current) => editingId !== null ? current.map((item) => item.id === editingId ? { ...item, ...nextItem } : item) : [...current, { id: Date.now(), ...nextItem }]);
    cancelForm();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#tong-quan" aria-label="Bình quân sinh hoạt - về đầu trang"><span className="brand-mark" aria-hidden="true">₫</span><span>Bình quân<br /><b>sinh hoạt</b></span></a>
        <button className="add-button" type="button" onClick={() => showForm ? cancelForm() : openAddForm()} aria-expanded={showForm} aria-controls="add-item-form"><span aria-hidden="true">+</span>{showForm ? "Đóng biểu mẫu" : "Thêm món đồ"}</button>
      </header>

      <section className="hero" id="tong-quan" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">KẾ HOẠCH CHI TIÊU CÁ NHÂN</p>
          <h1 id="page-title">Nhìn rõ chi phí<br />cho từng tháng.</h1>
          <p>Phân bổ giá trị tài sản theo thời gian sử dụng để chủ động ngân sách sinh hoạt.</p>
        </div>
        <div className="hero-figure" aria-hidden="true"><span></span><span></span><span></span><strong>{currency.format(summary.monthlyCost)}</strong><small>mỗi tháng</small></div>
      </section>

      <section className="overview" aria-label="Tổng quan chi phí">
        <article className="metric-card"><span className="metric-icon value" aria-hidden="true">⌁</span><p>Tổng giá trị tài sản</p><strong>{currency.format(summary.totalValue)}</strong><small>{items.length} tài sản đang theo dõi</small></article>
        <article className="metric-card"><span className="metric-icon year" aria-hidden="true">↗</span><p>Chi phí sử dụng / năm</p><strong>{currency.format(summary.yearlyCost)}</strong><small>Phân bổ theo vòng đời sử dụng</small></article>
        <article className="metric-card featured"><span className="metric-icon month" aria-hidden="true">◷</span><p>Ngân sách cần chuẩn bị</p><strong>{currency.format(summary.monthlyCost)}</strong><small>Chi phí trung bình mỗi tháng</small></article>
      </section>

      <section className="ledger" aria-labelledby="ledger-title">
        <div className="ledger-heading"><div><p className="eyebrow">DANH MỤC TÀI SẢN</p><h2 id="ledger-title">Chi tiết phân bổ</h2><p className="section-note">Mỗi khoản được quy đổi thành mức chi phí dễ theo dõi hằng tháng.</p></div><span className="item-count">{items.length} khoản</span></div>
        {showForm && <form className="add-form" id="add-item-form" onSubmit={saveItem}>
          <div className="form-intro"><p>{editingId !== null ? "Cập nhật tài sản" : "Thêm tài sản mới"}</p><span>Nhập số tiền và thời gian dự kiến sử dụng.</span></div>
          <label>Tên tài sản<input autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ví dụ: Máy lọc không khí" required /></label>
          <label>Nhóm<input list="category-options" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Gia dụng" /><datalist id="category-options"><option value="Gia dụng" /><option value="Công nghệ" /><option value="Di chuyển" /><option value="Khác" /></datalist></label>
          <label>Giá tiền (₫)<input inputMode="numeric" type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="0" required /></label>
          <label>Thời gian sử dụng<span className="duration-control"><input inputMode={form.durationUnit === "years" ? "decimal" : "numeric"} type="number" min={form.durationUnit === "years" ? "0.1" : "1"} step={form.durationUnit === "years" ? "0.1" : "1"} value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} placeholder={form.durationUnit === "years" ? "5" : "60"} required /><select aria-label="Đơn vị thời gian" value={form.durationUnit} onChange={(event) => setForm({ ...form, durationUnit: event.target.value as DurationUnit })}><option value="years">năm</option><option value="months">tháng</option></select></span></label>
          <div className="form-actions"><button className="secondary-button" type="button" onClick={cancelForm}>Huỷ</button><button className="save-button" type="submit">{editingId !== null ? "Cập nhật" : "Lưu tài sản"}</button></div>
        </form>}
        {items.length > 0 ? <div className="table-wrap"><table><caption className="sr-only">Danh sách tài sản và chi phí sử dụng</caption><thead><tr><th scope="col">TÀI SẢN</th><th scope="col">GIÁ TRỊ</th><th scope="col">THỜI GIAN</th><th scope="col">CHI PHÍ / THÁNG</th><th scope="col" aria-label="Thao tác"></th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><div className="item-name"><span className="item-icon" aria-hidden="true">{item.name.charAt(0)}</span><div><strong>{item.name}</strong><small>{item.category}</small></div></div></td><td>{currency.format(item.price)}</td><td><span className="duration">{formatDuration(item.months)}</span></td><td className="monthly-cost">{currency.format(item.price / item.months)}</td><td><div className="row-actions"><button className="edit-button" type="button" onClick={() => startEdit(item)} aria-label={`Sửa ${item.name}`}>Sửa</button><button className="delete-button" type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Xóa ${item.name}`}>×</button></div></td></tr>)}</tbody><tfoot><tr><td>TỔNG PHÂN BỔ</td><td>{currency.format(summary.totalValue)}</td><td>{items.length} khoản</td><td>{currency.format(summary.monthlyCost)}</td><td></td></tr></tfoot></table></div> : <div className="empty-state"><span className="empty-state-icon" aria-hidden="true">+</span><strong>Chưa có tài sản nào</strong><p>Thêm tài sản đầu tiên để bắt đầu theo dõi chi phí sử dụng.</p><button className="secondary-button" type="button" onClick={openAddForm}>Thêm tài sản</button></div>}
      </section>
      <footer className="footer-note"><span>●</span> Dữ liệu chỉ được lưu trên thiết bị của bạn · Phân bổ đều theo thời gian sử dụng.</footer>
    </main>
  );
}
