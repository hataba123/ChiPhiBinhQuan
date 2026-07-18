"use client";

import { FormEvent, useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  price: number;
  years: number;
  category: string;
};

const initialItems: Item[] = [
  { id: 1, name: "Máy giặt cửa trước", price: 12500000, years: 8, category: "Gia dụng" },
  { id: 2, name: "Tủ lạnh Inverter", price: 9800000, years: 10, category: "Gia dụng" },
  { id: 3, name: "Laptop làm việc", price: 22000000, years: 5, category: "Công nghệ" },
  { id: 4, name: "Điện thoại", price: 14500000, years: 4, category: "Công nghệ" },
];

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("vi-VN");
const emptyForm = { name: "", price: "", years: "", category: "Khác" };

export default function Home() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const summary = useMemo(() => {
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    const yearlyCost = items.reduce((sum, item) => sum + item.price / item.years, 0);
    return { totalValue, yearlyCost, monthlyCost: yearlyCost / 12 };
  }, [items]);

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(form.price);
    const years = Number(form.years);

    if (!form.name.trim() || price <= 0 || years <= 0) return;

    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        name: form.name.trim(),
        price,
        years,
        category: form.category.trim() || "Khác",
      },
    ]);
    setForm(emptyForm);
    setShowForm(false);
  }

  function cancelForm() {
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="brand-mark" aria-hidden="true">
          <span>₫</span>
        </div>
        <div className="hero-content">
          <p className="eyebrow">QUẢN LÝ CHI TIÊU CÁ NHÂN</p>
          <h1>Bình quân sinh hoạt</h1>
          <p className="hero-copy">Theo dõi giá trị tài sản và chi phí sử dụng thực tế mỗi tháng.</p>
        </div>
        <div className="hero-decoration" aria-hidden="true"><i></i><i></i><i></i></div>
      </section>

      <section className="overview" aria-label="Tổng quan chi phí">
        <article className="metric-card primary">
          <p>Tổng giá trị tài sản</p>
          <strong>{currency.format(summary.totalValue)}</strong>
          <span>{items.length} món đồ đang theo dõi</span>
        </article>
        <article className="metric-card">
          <p>Chi phí sử dụng / năm</p>
          <strong>{currency.format(summary.yearlyCost)}</strong>
          <span>Bình quân từ toàn bộ tài sản</span>
        </article>
        <article className="metric-card accent">
          <p>Chi phí trung bình / tháng</p>
          <strong>{currency.format(summary.monthlyCost)}</strong>
          <span>Ngân sách sử dụng hàng tháng</span>
        </article>
      </section>

      <section className="ledger" aria-labelledby="ledger-title">
        <div className="ledger-heading">
          <div>
            <p className="eyebrow">DANH SÁCH TÀI SẢN</p>
            <h2 id="ledger-title">Chi tiết món đồ</h2>
          </div>
          <button
            className="add-button"
            type="button"
            onClick={() => setShowForm((current) => !current)}
            aria-expanded={showForm}
            aria-controls="add-item-form"
          >
            <span aria-hidden="true">+</span> {showForm ? "Đóng biểu mẫu" : "Thêm món đồ"}
          </button>
        </div>

        {showForm && (
          <form className="add-form" id="add-item-form" onSubmit={addItem}>
            <label>
              Tên món đồ
              <input autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ví dụ: Máy lọc không khí" required />
            </label>
            <label>
              Nhóm
              <input list="category-options" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Gia dụng" />
              <datalist id="category-options">
                <option value="Gia dụng" />
                <option value="Công nghệ" />
                <option value="Di chuyển" />
                <option value="Khác" />
              </datalist>
            </label>
            <label>
              Giá tiền (₫)
              <input inputMode="numeric" type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="0" required />
            </label>
            <label>
              Thời gian sử dụng (năm)
              <input inputMode="decimal" type="number" min="0.1" step="0.1" value={form.years} onChange={(event) => setForm({ ...form, years: event.target.value })} placeholder="5" required />
            </label>
            <div className="form-actions">
              <button className="secondary-button" type="button" onClick={cancelForm}>Huỷ</button>
              <button className="save-button" type="submit">Lưu món đồ</button>
            </div>
          </form>
        )}

        {items.length > 0 ? (
          <div className="table-wrap">
            <table>
              <caption className="sr-only">Danh sách tài sản và chi phí sử dụng</caption>
              <thead>
                <tr><th scope="col">MÓN ĐỒ</th><th scope="col">GIÁ TIỀN</th><th scope="col">THỜI GIAN SỬ DỤNG</th><th scope="col">TIỀN SỬ DỤNG / NĂM</th><th scope="col" aria-label="Thao tác"></th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><div className="item-name"><span className="item-icon" aria-hidden="true">{item.name.charAt(0)}</span><div><strong>{item.name}</strong><small>{item.category}</small></div></div></td>
                    <td>{currency.format(item.price)}</td>
                    <td><span className="duration">{number.format(item.years)} năm</span></td>
                    <td className="annual-cost">{currency.format(item.price / item.years)}</td>
                    <td><button className="delete-button" type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Xóa ${item.name}`}>×</button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td>TỔNG CỘNG</td><td>{currency.format(summary.totalValue)}</td><td>{items.length} món đồ</td><td>{currency.format(summary.yearlyCost)}</td><td></td></tr></tfoot>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">＋</span>
            <strong>Chưa có món đồ nào</strong>
            <p>Thêm tài sản đầu tiên để bắt đầu theo dõi chi phí sử dụng.</p>
            <button className="secondary-button" type="button" onClick={() => setShowForm(true)}>Thêm món đồ</button>
          </div>
        )}
      </section>

      <p className="footer-note">Các số liệu được tính theo phương pháp phân bổ đều trong thời gian sử dụng.</p>
    </main>
  );
}
