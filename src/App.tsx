import { useMemo, useState } from "react";

type Role = "kasir" | "admin";
type Page =
  | "login"
  | "menu"
  | "transaction"
  | "payment"
  | "history"
  | "schedule"
  | "adminTransactions"
  | "packages";

type PackageItem = {
  code: string;
  name: string;
  category: string;
  price: number | null;
  quota: number;
  used: number;
  active: boolean;
  desc: string;
};

const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const initialPackages: PackageItem[] = [
  { code: "DEK-01", name: "Silver", category: "Dekorasi", price: 25000000, quota: 3, used: 2, active: true, desc: "Pelaminan, gate, photo booth & kursi hingga 300 tamu" },
  { code: "DEK-02", name: "Gold", category: "Dekorasi", price: 45000000, quota: 3, used: 3, active: true, desc: "Bunga segar dominan, uplight & kursi hingga 500 tamu" },
  { code: "DEK-03", name: "Platinum", category: "Dekorasi", price: 75000000, quota: 3, used: 1, active: true, desc: "Bunga impor, ceiling bunga dan lampu gantung" },
  { code: "DEK-04", name: "Adat Sunda Full", category: "Dekorasi", price: 55000000, quota: 3, used: 2, active: true, desc: "Janur, kembang tujuh rupa, properti siraman & tumpeng" },
  { code: "MUA-01", name: "Ayu Beauty Studio", category: "MUA", price: 3500000, quota: 3, used: 1, active: true, desc: "Natural dan soft glam" },
  { code: "MUA-02", name: "Kinanti Makeup Art", category: "MUA", price: 5000000, quota: 3, used: 2, active: true, desc: "Spesialis adat Sunda dan paes" },
  { code: "MUA-03", name: "Lavina Glam", category: "MUA", price: 6000000, quota: 3, used: 1, active: true, desc: "Glam modern untuk hari istimewa" },
  { code: "MUA-04", name: "Hana Hijab Artistry", category: "MUA", price: 4500000, quota: 3, used: 2, active: true, desc: "Tata rias pengantin hijab" },
  { code: "SUN-01", name: "Basic", category: "Rias Adat Sunda", price: 1500000, quota: 3, used: 0, active: true, desc: "Sanggul dan siger" },
  { code: "SUN-02", name: "Lengkap", category: "Rias Adat Sunda", price: 4000000, quota: 3, used: 1, active: true, desc: "Siger, sanggul, paes, pakaian adat" },
  { code: "SUN-03", name: "Keluarga", category: "Rias Adat Sunda", price: 6500000, quota: 3, used: 1, active: true, desc: "Paket lengkap plus rias 4 orang keluarga" },
  { code: "FG-01", name: "Lensa Nusantara Team", category: "Fotografer", price: 6000000, quota: 3, used: 1, active: true, desc: "Dokumentasi lengkap hingga acara selesai" },
  { code: "FG-02", name: "Kisah Abadi Photography", category: "Fotografer", price: 9000000, quota: 3, used: 1, active: true, desc: "Dokumentasi lengkap dan album cetak" },
  { code: "FG-03", name: "Cahaya Pelita Studio", category: "Fotografer", price: 15000000, quota: 3, used: 2, active: true, desc: "Foto, video sinematik dan album premium" },
  { code: "FG-04", name: "Bingkai Rasa Crew", category: "Fotografer", price: 7000000, quota: 3, used: 0, active: true, desc: "Dokumentasi foto hingga acara selesai" },
  { code: "WCC-01", name: "Raka Moment", category: "WCC", price: 2000000, quota: 3, used: 1, active: true, desc: "Konten singkat real-time hari pernikahan" },
  { code: "WCC-02", name: "Sinta Story", category: "WCC", price: 2500000, quota: 3, used: 1, active: true, desc: "Story dan reels wedding day" },
  { code: "ADT-01", name: "Upacara Biasa", category: "Upacara Adat", price: null, quota: 3, used: 0, active: true, desc: "Sanggar Mekar Budaya • Transport terpisah sesuai jarak" },
  { code: "ADT-03", name: "Upacara + Mapag Singa", category: "Upacara Adat", price: null, quota: 3, used: 1, active: true, desc: "Sanggar Mekar Budaya • Transport terpisah sesuai jarak" },
  { code: "HEN-01", name: "Nayla Henna Basic", category: "Henna", price: 700000, quota: 3, used: 0, active: true, desc: "Henna pengantin basic" },
  { code: "HEN-02", name: "Nayla Henna Lengkap", category: "Henna", price: 1000000, quota: 3, used: 1, active: true, desc: "Henna pengantin lengkap" },
  { code: "HIB-01", name: "Akustik Senja Trio", category: "Hiburan", price: 2500000, quota: 3, used: 0, active: true, desc: "Trio akustik untuk suasana hangat" },
  { code: "HIB-04", name: "Degung Nada Priangan", category: "Hiburan", price: 6000000, quota: 3, used: 1, active: true, desc: "Ansambel degung khas Sunda" },
  { code: "CAT-01", name: "Dapur Bunda 300 Pax", category: "Catering", price: 30000000, quota: 3, used: 1, active: true, desc: "Prasmanan lengkap untuk 300 tamu" },
  { code: "CAT-03", name: "Rasa Sunda 300 Pax", category: "Catering", price: 35000000, quota: 3, used: 0, active: true, desc: "Menu Sunda untuk 300 tamu" },
  { code: "VND-01", name: "MC Adat Sunda", category: "Vendor Lain", price: 1500000, quota: 3, used: 0, active: true, desc: "Pembawa acara adat berpengalaman" },
  { code: "VND-05", name: "WO Hari H", category: "Vendor Lain", price: 5000000, quota: 3, used: 1, active: true, desc: "Koordinasi lengkap di hari acara" },
];

const transactions = [
  { no: "TRX-2026-0039", customer: "Rani & Dimas", phone: "0812-xxxx-1001", date: "14 Des 2026", location: "Gedung Sasana Budaya Bandung", packages: "DEK-04, SUN-02, FG-02, HIB-04", total: 76000000, paid: 30000000, status: "Belum Lunas", method: "Transfer Bank", type: "DP", cashier: "Siti" },
  { no: "TRX-2026-0040", customer: "Salsa & Fikri", phone: "0813-xxxx-1002", date: "14 Des 2026", location: "Subang", packages: "DEK-02, MUA-04, WCC-02", total: 52000000, paid: 52000000, status: "Lunas", method: "QRIS", type: "Lunas", cashier: "Siti" },
  { no: "TRX-2026-0041", customer: "Nadia & Ardi", phone: "0857-xxxx-1003", date: "21 Des 2026", location: "Graha Puspa Subang", packages: "DEK-01, HEN-02, CAT-01", total: 56000000, paid: 20000000, status: "Belum Lunas", method: "Tunai", type: "DP", cashier: "Siti" },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    flower: <><circle cx="12" cy="12" r="2.5"/><path d="M12 9c-4-1-4-6 0-6s4 5 0 6Zm3 3c1-4 6-4 6 0s-5 4-6 0Zm-3 3c4 1 4 6 0 6s-4-5 0-6Zm-3-3c-1 4-6 4-6 0s5-4 6 0Z"/></>,
    receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6"/></>,
    wallet: <><path d="M4 7h16v12H4a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3h12"/><path d="M15 11h5v4h-5a2 2 0 0 1 0-4Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    back: <><path d="M19 12H5M11 18l-6-6 6-6"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[name] || paths.flower}</svg>;
}

function FloralMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`floral-mark ${small ? "small" : ""}`} aria-hidden>
      <span className="petal p1" /><span className="petal p2" /><span className="petal p3" /><span className="petal p4" /><i />
    </div>
  );
}

function Button({ children, onClick, variant = "primary", disabled = false, type = "button" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; disabled?: boolean; type?: "button" | "submit" }) {
  return <button type={type} className={`btn ${variant}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "red" | "gold" | "pink" | "neutral" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function AppHeader({ role, title, onBack, onLogout }: { role: Role; title?: string; onBack?: () => void; onLogout: () => void }) {
  return (
    <header className="app-header">
      <div className="header-left">
        {onBack && <button className="icon-button" onClick={onBack} aria-label="Kembali"><Icon name="back" /></button>}
        <div className="brand-mini"><FloralMark small /><div><strong>Pelaminan Kasih</strong>{title && <span>{title}</span>}</div></div>
      </div>
      <div className="header-user">
        <div className="user-avatar">{role === "kasir" ? "S" : "R"}</div>
        <div><strong>{role === "kasir" ? "Siti" : "Rina"}</strong><span>{role === "kasir" ? "Kasir" : "Admin"}</span></div>
        <button className="logout-button" onClick={onLogout}><Icon name="logout" size={18} /> Keluar</button>
      </div>
    </header>
  );
}

function PageTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return <div className="page-title"><div><span>{eyebrow}</span><h1>{title}</h1>{desc && <p>{desc}</p>}</div><div className="title-ornament"><span /><FloralMark small /><span /></div></div>;
}

function Login({ role, setRole, onLogin }: { role: Role; setRole: (r: Role) => void; onLogin: () => void }) {
  const [showError, setShowError] = useState(false);
  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="photo-credit">Foto: Galuh hari setiawan / Unsplash</div>
        <div className="login-overlay" />
        <div className="visual-copy">
          <FloralMark />
          <p>Merangkai momen, menata kebahagiaan</p>
          <h1>Pelaminan<br />Kasih</h1>
          <div className="gold-rule"><span /><Icon name="flower" size={18} /><span /></div>
          <p className="visual-note">Sistem Kasir & Admin Paket Pernikahan</p>
        </div>
      </section>
      <section className="login-form-wrap">
        <div className="corner-flower"><FloralMark /></div>
        <form className="login-card" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <span className="eyebrow">Selamat datang kembali</span>
          <h2>Masuk ke akun Anda</h2>
          <p>Kelola setiap detail hari istimewa dengan lebih mudah.</p>
          <label>Username<input defaultValue={role === "kasir" ? "siti.kasir" : "rina.admin"} placeholder="Masukkan username" /></label>
          <label>Kata sandi<input type="password" defaultValue="pelaminankasih" placeholder="Masukkan kata sandi" /></label>
          {showError && <div className="form-error">Username atau kata sandi belum sesuai. Silakan coba lagi.</div>}
          <Button type="submit">Masuk <Icon name="arrow" size={18} /></Button>
          <div className="demo-switch">
            <span>Mode demo</span>
            <div><button type="button" className={role === "kasir" ? "active" : ""} onClick={() => setRole("kasir")}>Kasir</button><button type="button" className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>Admin</button></div>
          </div>
          <button className="error-demo" type="button" onClick={() => setShowError(!showError)}>Coba tampilan pesan error</button>
        </form>
        <p className="copyright">© 2026 Pelaminan Kasih • Dibuat dengan sepenuh hati</p>
      </section>
    </main>
  );
}

const menuByRole = {
  kasir: [
    { page: "transaction", icon: "receipt", title: "Transaksi Baru", desc: "Buat pesanan dan pilih paket wedding" },
    { page: "payment", icon: "wallet", title: "Pelunasan", desc: "Catat cicilan atau pelunasan tagihan" },
    { page: "history", icon: "history", title: "Riwayat Pembayaran", desc: "Telusuri pembayaran seluruh customer" },
    { page: "schedule", icon: "calendar", title: "Jadwal", desc: "Lihat agenda acara pernikahan" },
  ],
  admin: [
    { page: "schedule", icon: "calendar", title: "Jadwal", desc: "Lihat agenda dan kebutuhan tiap divisi" },
    { page: "adminTransactions", icon: "receipt", title: "Transaksi", desc: "Pantau transaksi yang masuk dari kasir" },
    { page: "packages", icon: "box", title: "Kelola Paket", desc: "Atur paket, harga, dan kuota harian" },
  ],
};

function MainMenu({ role, navigate, logout }: { role: Role; navigate: (p: Page) => void; logout: () => void }) {
  return (
    <div className="app-shell">
      <AppHeader role={role} onLogout={logout} />
      <main className="content menu-content">
        <PageTitle eyebrow={`Menu ${role === "kasir" ? "Kasir" : "Admin"}`} title={`Wilujeng sumping, ${role === "kasir" ? "Siti" : "Rina"}`} desc="Pilih layanan yang ingin Anda kelola hari ini." />
        <div className={`menu-grid ${role}`}>
          {menuByRole[role].map((item, index) => (
            <button className="menu-card" key={item.page} onClick={() => navigate(item.page as Page)}>
              <span className="menu-number">0{index + 1}</span>
              <span className="menu-icon"><Icon name={item.icon} size={28} /></span>
              <span className="menu-text"><strong>{item.title}</strong><small>{item.desc}</small></span>
              <span className="menu-arrow"><Icon name="arrow" size={20} /></span>
              <FloralMark small />
            </button>
          ))}
        </div>
        <div className="menu-quote"><span /><Icon name="flower" size={17} /><p>Setiap detail kecil adalah bagian dari cerita besar mereka.</p><Icon name="flower" size={17} /><span /></div>
      </main>
    </div>
  );
}

function TransactionWizard({ role, packages, back, logout }: { role: Role; packages: PackageItem[]; back: () => void; logout: () => void }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Dekorasi");
  const [cart, setCart] = useState<PackageItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState<"Lunas" | "DP / Cicilan">("DP / Cicilan");
  const [payment, setPayment] = useState(30000000);
  const [customerSaved, setCustomerSaved] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(false);
  const [method, setMethod] = useState("Transfer Bank");
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const total = Math.max(0, subtotal - discount);
  const paid = paymentType === "Lunas" ? total : payment;
  const invalid = paid <= 0 || paid > total;
  const categories = ["Dekorasi", "MUA", "Rias Adat Sunda", "Fotografer", "WCC", "Upacara Adat", "Henna", "Hiburan", "Catering", "Vendor Lain"];
  const toggleCart = (item: PackageItem) => setCart((current) => current.some((p) => p.code === item.code) ? current.filter((p) => p.code !== item.code) : [...current, item]);
  const canNext = step === 1 ? selectedCustomer : step === 3 ? cart.length > 0 : step === 4 ? !invalid && total > 0 : true;

  return (
    <div className="app-shell">
      <AppHeader role={role} title="Transaksi Baru" onBack={back} onLogout={logout} />
      <main className="content wizard-content">
        <div className="wizard-top">
          {[["Customer", "users"], ["Acara", "calendar"], ["Pilih Paket", "box"], ["Pembayaran", "wallet"], ["Ringkasan", "receipt"]].map(([label, icon], i) => (
            <div className={`step ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`} key={label}>
              <span>{step > i + 1 ? <Icon name="check" size={16} /> : <Icon name={icon} size={17} />}</span><small>{i + 1}. {label}</small>
            </div>
          ))}
        </div>
        <div className="wizard-heading"><span>Langkah {step} dari 5</span><h1>{["Pilih Customer", "Detail Acara", "Pilih Paket Wedding", "Pembayaran", "Transaksi Berhasil"][step - 1]}</h1></div>

        {step === 1 && <div className="two-column">
          <section className="panel">
            <h3>Cari customer</h3>
            <div className="search-box"><Icon name="search" /><input placeholder="Cari nama atau no. WhatsApp" defaultValue="Rani" /><Button variant="secondary">Cari</Button></div>
            <div className={`customer-result ${selectedCustomer ? "selected" : ""}`}>
              <div className="avatar">RD</div><div><strong>Rani & Dimas</strong><span>0812-xxxx-1001</span><small>Bandung, Jawa Barat</small></div>
              <Button variant={selectedCustomer ? "primary" : "secondary"} onClick={() => setSelectedCustomer(true)}>{selectedCustomer ? <><Icon name="check" size={17} /> Dipilih</> : "Pilih"}</Button>
            </div>
          </section>
          <section className="panel soft-panel">
            <h3>Customer belum terdaftar?</h3><p>Tambahkan data customer baru untuk melanjutkan transaksi.</p>
            {!customerSaved ? <div className="form-stack"><label>Nama lengkap<input placeholder="Nama pasangan / customer" /></label><label>No. WhatsApp<input placeholder="08xx-xxxx-xxxx" /></label><label>Alamat<textarea placeholder="Alamat lengkap customer" /></label><Button variant="secondary" onClick={() => setCustomerSaved(true)}><Icon name="plus" size={17} /> Simpan Customer</Button></div>
            : <div className="success-note"><Icon name="check" /><div><strong>Customer berhasil disimpan</strong><span>Data siap dipilih untuk transaksi.</span></div></div>}
          </section>
        </div>}

        {step === 2 && <section className="panel event-panel">
          <div className="form-grid">
            <label>Tanggal acara<input type="date" defaultValue="2026-12-14" /></label>
            <label>Jam acara<input type="time" defaultValue="09:00" /></label>
            <label className="full">Lokasi acara<div className="input-icon"><Icon name="map" size={18} /><input defaultValue="Gedung Sasana Budaya Bandung" /></div></label>
          </div>
          <div className="info-note"><Icon name="calendar" /><div><strong>14 Desember 2026 termasuk jadwal padat</strong><span>Sudah ada 2 acara pada tanggal ini. Kuota paket akan dicek otomatis.</span></div><Badge tone="gold">PADAT</Badge></div>
        </section>}

        {step === 3 && <div className="package-layout">
          <div className="package-main">
            <div className="category-tabs">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} className={category === c ? "active" : ""}>{c}</button>)}</div>
            <div className="package-grid">
              {packages.filter((p) => p.category === category && p.active).map((item) => {
                const full = item.used >= item.quota;
                const selected = cart.some((p) => p.code === item.code);
                return <article className={`package-card ${full ? "full" : ""} ${selected ? "selected" : ""}`} key={item.code}>
                  <div className="package-top"><span>{item.code}</span>{full ? <Badge tone="red">PAKET PENUH</Badge> : selected ? <Badge tone="green">DIPILIH</Badge> : null}</div>
                  <h3>{item.name}</h3><p>{item.desc}</p>
                  {item.category === "MUA" && selected && <select className="look-select" defaultValue="Soft Glam"><option>Natural Soft</option><option>Soft Glam</option><option>Full Glam</option><option>Paes Sunda</option><option>Korean Look</option><option>Hijab Modern</option></select>}
                  <div className="quota"><span><i style={{ width: `${(item.used / item.quota) * 100}%` }} /></span><small>{full ? "Kuota habis" : `Terisi ${item.used} dari ${item.quota}`}</small></div>
                  <div className="package-bottom"><strong>{item.price ? money(item.price) : "Harga belum diisi"}</strong><Button variant={selected ? "primary" : "secondary"} disabled={full || item.price === null} onClick={() => toggleCart(item)}>{selected ? "Hapus" : "Tambah"}</Button></div>
                  {full && <button className="text-link">Pilih tanggal atau paket lain</button>}
                  {item.price === null && <small className="price-warning">Admin perlu melengkapi harga</small>}
                </article>;
              })}
            </div>
          </div>
          <aside className="cart-panel">
            <div className="cart-title"><div><span>Keranjang paket</span><h3>{cart.length} paket dipilih</h3></div><div className="cart-count">{cart.length}</div></div>
            {cart.length === 0 ? <div className="empty-cart"><Icon name="box" size={32} /><p>Belum ada paket dipilih</p></div> : cart.map((item, index) => <div className="cart-item" key={item.code}><span>{index + 1}</span><div><strong>{item.name}</strong><small>{item.code} • Booking ke-{item.used + 1}</small></div><b>{money(item.price || 0)}</b><button onClick={() => toggleCart(item)}>×</button></div>)}
            <label className="discount-label">Diskon<div className="currency-input"><span>Rp</span><input type="number" value={discount || ""} placeholder="0" onChange={(e) => setDiscount(Number(e.target.value))} /></div></label>
            <div className="cart-totals"><p><span>Subtotal</span><b>{money(subtotal)}</b></p><p><span>Diskon</span><b>- {money(discount)}</b></p><div><span>Total Tagihan</span><strong>{money(total)}</strong></div></div>
            <small className="saved-price">Harga tersimpan saat transaksi</small>
          </aside>
        </div>}

        {step === 4 && <div className="payment-layout">
          <section className="panel">
            <h3>Metode pembayaran</h3><div className="method-grid">{["Tunai", "Transfer Bank", "QRIS", "E-Wallet", "Debit"].map((m) => <button key={m} className={method === m ? "active" : ""} onClick={() => setMethod(m)}><Icon name={m === "Tunai" ? "wallet" : "card"} /><span>{m}</span>{method === m && <i><Icon name="check" size={12} /></i>}</button>)}</div>
            <h3>Tipe pembayaran</h3><div className="payment-type"><button className={paymentType === "Lunas" ? "active" : ""} onClick={() => setPaymentType("Lunas")}><span /><div><strong>Lunas</strong><small>Bayar seluruh tagihan</small></div></button><button className={paymentType === "DP / Cicilan" ? "active" : ""} onClick={() => setPaymentType("DP / Cicilan")}><span /><div><strong>DP / Cicilan</strong><small>Bayar sebagian tagihan</small></div></button></div>
            <label>Nominal pembayaran<div className={`currency-input large ${invalid ? "invalid" : ""}`}><span>Rp</span><input type="number" value={paid || ""} onChange={(e) => setPayment(Number(e.target.value))} disabled={paymentType === "Lunas"} /></div></label>
            {invalid && <div className="field-error">Nominal harus lebih dari Rp 0 dan tidak boleh melebihi total tagihan.</div>}
            <button className="error-example" onClick={() => { setPaymentType("DP / Cicilan"); setPayment(total + 1000000); }}>Tampilkan contoh validasi nominal</button>
          </section>
          <aside className="summary-card">
            <span>Ringkasan pembayaran</span><h3>Rani & Dimas</h3><p>14 Desember 2026 • 09.00</p>
            <div className="summary-list"><div><span>Total Tagihan</span><b>{money(total)}</b></div><div><span>Dibayar</span><b className="green">{money(invalid ? 0 : paid)}</b></div><div className="remainder"><span>Sisa Tagihan</span><strong>{money(invalid ? total : Math.max(0, total - paid))}</strong></div></div>
            <Badge tone={paid === total && !invalid ? "green" : "red"}>{paid === total && !invalid ? "LUNAS" : "BELUM LUNAS"}</Badge>
          </aside>
        </div>}

        {step === 5 && <div className="success-layout">
          <section className="success-hero"><div className="success-check"><Icon name="check" size={34} /></div><span>Transaksi berhasil disimpan</span><h1>Terima kasih, Rani & Dimas</h1><p>Jadwal kerja otomatis dibuat dan terkirim ke Admin.</p></section>
          <section className="receipt-preview">
            <div className="receipt-header"><FloralMark small /><div><span>Pelaminan Kasih</span><h2>Kwitansi Pembayaran</h2></div><FloralMark small /></div>
            <div className="receipt-no"><span>No. Transaksi</span><strong>TRX-2026-0042</strong><Badge tone={paid === total ? "green" : "red"}>{paid === total ? "LUNAS" : "BELUM LUNAS"}</Badge></div>
            <div className="receipt-grid"><div><span>Customer</span><strong>Rani & Dimas</strong><small>0812-xxxx-1001</small></div><div><span>Acara</span><strong>14 Desember 2026, 09.00</strong><small>Gedung Sasana Budaya Bandung</small></div></div>
            <div className="receipt-packages">{cart.map((item) => <div key={item.code}><span>{item.code} • {item.name}</span><strong>{money(item.price || 0)}</strong></div>)}</div>
            <div className="receipt-total"><span>Dibayar via {method}<small>Diproses oleh Siti (Kasir) • 20 Okt 2026, 14.32</small></span><strong>{money(paid)}</strong></div>
          </section>
          <div className="success-actions"><Button variant="secondary"><Icon name="receipt" size={18} /> Cetak Kwitansi</Button><Button onClick={() => { setStep(1); setCart([]); }}>Transaksi Baru <Icon name="arrow" size={18} /></Button></div>
        </div>}

        {step < 5 && <div className="wizard-actions"><Button variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)}><Icon name="back" size={18} /> Kembali</Button><Button disabled={!canNext} onClick={() => setStep(step + 1)}>Lanjutkan <Icon name="arrow" size={18} /></Button></div>}
      </main>
    </div>
  );
}

function PaymentPage({ role, back, logout }: { role: Role; back: () => void; logout: () => void }) {
  const [selected, setSelected] = useState(false);
  const [paidOff, setPaidOff] = useState(false);
  const [amount, setAmount] = useState(46000000);
  return <div className="app-shell"><AppHeader role={role} title="Pelunasan" onBack={back} onLogout={logout} /><main className="content">
    <PageTitle eyebrow="Kasir • Pembayaran" title="Pelunasan Tagihan" desc="Cari transaksi dan catat pembayaran customer." />
    {!selected ? <section className="panel search-transaction"><div className="search-box"><Icon name="search" /><input defaultValue="Rani" placeholder="Nama customer atau nomor transaksi" /><Button onClick={() => setSelected(true)}>Cari Transaksi</Button></div>
      <div className="search-result-row"><div className="avatar">RD</div><div><strong>Rani & Dimas</strong><span>TRX-2026-0039 • 14 Des 2026</span></div><Badge tone="red">Belum Lunas</Badge><Button variant="secondary" onClick={() => setSelected(true)}>Pilih</Button></div>
    </section> : <div className="payment-detail">
      <section className="panel"><div className="section-head"><div><span>TRX-2026-0039</span><h2>Rani & Dimas</h2></div><Badge tone={paidOff ? "green" : "red"}>{paidOff ? "Lunas" : "Belum Lunas"}</Badge></div>
        <div className="metric-row"><div><span>Total Tagihan</span><strong>{money(76000000)}</strong></div><div><span>Sudah Dibayar</span><strong>{money(paidOff ? 76000000 : 30000000)}</strong></div><div className="highlight"><span>Sisa Tagihan</span><strong>{money(paidOff ? 0 : 46000000)}</strong></div></div>
        <h3>Riwayat pembayaran</h3><div className="timeline"><i /><div><strong>DP Pertama</strong><span>12 Oktober 2026 • Transfer Bank</span></div><b>{money(30000000)}</b></div>
      </section>
      <section className="panel payoff-form">{paidOff ? <div className="paid-success"><div><Icon name="check" size={32} /></div><h2>Tagihan sudah lunas</h2><p>Pembayaran berhasil disimpan dan status transaksi diperbarui.</p><Button variant="secondary"><Icon name="receipt" size={18} /> Cetak Kwitansi</Button></div> : <>
        <h3>Catat pembayaran baru</h3><label>Nominal bayar<div className={`currency-input large ${amount > 46000000 ? "invalid" : ""}`}><span>Rp</span><input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div></label>{amount > 46000000 && <div className="field-error">Nominal tidak boleh melebihi sisa tagihan Rp 46.000.000.</div>}
        <label>Metode bayar<select defaultValue="Transfer Bank"><option>Tunai</option><option>Transfer Bank</option><option>QRIS</option><option>E-Wallet</option><option>Debit</option></select></label>
        <div className="new-remainder"><span>Sisa setelah pembayaran</span><strong>{money(Math.max(0, 46000000 - amount))}</strong></div><Button disabled={amount <= 0 || amount > 46000000} onClick={() => setPaidOff(amount === 46000000)}>Simpan Pembayaran</Button></>}
      </section>
    </div>}
  </main></div>;
}

function HistoryPage({ role, back, logout }: { role: Role; back: () => void; logout: () => void }) {
  const [status, setStatus] = useState("Semua");
  const [method, setMethod] = useState("Semua");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<typeof transactions[0] | null>(null);
  const filtered = transactions.filter((t) => (status === "Semua" || t.status === status) && (method === "Semua" || t.method === method) && t.customer.toLowerCase().includes(query.toLowerCase()));
  return <div className="app-shell"><AppHeader role={role} title="Riwayat Pembayaran" onBack={back} onLogout={logout} /><main className="content">
    <PageTitle eyebrow="Kasir • Arsip" title="Riwayat Pembayaran" desc="Telusuri semua pembayaran dan sisa tagihan customer." />
    <section className="filter-bar"><label>Cari customer<div className="input-icon"><Icon name="search" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nama customer" /></div></label><label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option>Semua</option><option>Lunas</option><option>Belum Lunas</option></select></label><label>Metode<select value={method} onChange={(e) => setMethod(e.target.value)}><option>Semua</option><option>Tunai</option><option>Transfer Bank</option><option>QRIS</option></select></label><label>Rentang tanggal<input type="date" defaultValue="2026-10-01" /></label></section>
    <section className="table-panel"><div className="table-headline"><span>Menampilkan {filtered.length} pembayaran</span><Button variant="secondary">Unduh Laporan</Button></div><div className="table-wrap"><table><thead><tr><th>No. Transaksi</th><th>Customer</th><th>Tanggal Bayar</th><th>Nominal</th><th>Metode</th><th>Tipe</th><th>Sisa</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((t, i) => <tr key={t.no} className={t.status === "Belum Lunas" ? "unpaid" : ""} onClick={() => setDetail(t)}><td><strong>{t.no}</strong></td><td>{t.customer}</td><td>{i === 0 ? "12 Okt 2026" : i === 1 ? "15 Okt 2026" : "18 Okt 2026"}</td><td className="tabular">{money(t.paid)}</td><td>{t.method}</td><td>{t.type}</td><td className="tabular">{money(t.total - t.paid)}</td><td><Badge tone={t.status === "Lunas" ? "green" : "red"}>{t.status}</Badge></td><td><Icon name="chevron" size={17} /></td></tr>)}</tbody></table></div></section>
    {detail && <div className="drawer-backdrop" onClick={() => setDetail(null)}><aside className="detail-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setDetail(null)}>×</button><span className="eyebrow">Detail transaksi</span><h2>{detail.customer}</h2><p>{detail.no}</p><div className="drawer-summary"><div><span>Total</span><strong>{money(detail.total)}</strong></div><div><span>Sudah dibayar</span><strong>{money(detail.paid)}</strong></div><div><span>Sisa</span><strong>{money(detail.total - detail.paid)}</strong></div></div><h3>Riwayat pembayaran</h3><div className="timeline"><i /><div><strong>{detail.type} via {detail.method}</strong><span>Dicatat oleh {detail.cashier} (Kasir)</span></div><b>{money(detail.paid)}</b></div></aside></div>}
  </main></div>;
}

function SchedulePage({ role, back, logout }: { role: Role; back: () => void; logout: () => void }) {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selected, setSelected] = useState<string | null>(null);
  const days = Array.from({ length: 35 }, (_, i) => i - 1);
  return <div className="app-shell"><AppHeader role={role} title="Jadwal" onBack={back} onLogout={logout} /><main className="content">
    <div className="title-with-toggle"><PageTitle eyebrow={`${role === "kasir" ? "Kasir" : "Admin"} • Agenda`} title="Jadwal Pernikahan" desc="Semua jadwal tersinkron otomatis dari transaksi kasir." /><div className="view-toggle"><button className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}><Icon name="calendar" size={17} /> Kalender</button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><Icon name="history" size={17} /> Daftar</button></div></div>
    {view === "calendar" ? <section className="calendar-panel"><div className="calendar-header"><button>‹</button><h2>Desember 2026</h2><button>›</button></div><div className="weekdays">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => <span key={d}>{d}</span>)}</div><div className="calendar-grid">{days.map((day, i) => <button key={i} className={`${day < 1 ? "muted" : ""} ${day === 14 ? "busy" : ""} ${day === 21 ? "has-event" : ""}`} onClick={() => (day === 14 || day === 21) && setSelected(String(day))}>{day > 0 && day <= 31 ? <><b>{day}</b>{day === 14 && <><Badge tone="gold">PADAT</Badge><small>09.00 Rani & Dimas</small><small>10.00 Salsa & Fikri</small></>}{day === 21 && <small>10.00 Nadia & Ardi</small>}</> : null}</button>)}</div></section>
    : <section className="schedule-list">{transactions.map((t) => <button key={t.no} onClick={() => setSelected(t.date.startsWith("14") ? "14" : "21")}><div className="date-block"><strong>{t.date.split(" ")[0]}</strong><span>DES</span></div><div><strong>{t.customer}</strong><span><Icon name="map" size={15} /> {t.location}</span></div><span>{t.date.startsWith("14") ? "09.00" : "10.00"} WIB</span><Badge tone={t.status === "Lunas" ? "green" : "red"}>{t.status}</Badge><Icon name="chevron" /></button>)}</section>}
    {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><aside className="detail-drawer schedule-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelected(null)}>×</button><span className="eyebrow">Detail acara • {selected} Des 2026</span><h2>{selected === "14" ? "Rani & Dimas" : "Nadia & Ardi"}</h2><p><Icon name="map" size={16} /> {selected === "14" ? "Gedung Sasana Budaya Bandung" : "Graha Puspa Subang"}</p><div className="event-time"><Icon name="calendar" /><div><strong>{selected} Desember 2026</strong><span>09.00 – 14.00 WIB</span></div></div><h3>Kebutuhan per divisi</h3>{[["Dekorasi", selected === "14" ? "DEK-04 • Adat Sunda Full" : "DEK-01 • Silver"], ["Rias & MUA", selected === "14" ? "SUN-02 • Rias Sunda Lengkap" : "—"], ["Dokumentasi", selected === "14" ? "FG-02 • Kisah Abadi" : "—"], ["Catering", selected === "21" ? "CAT-01 • Dapur Bunda 300 Pax" : "—"]].map((x) => <div className="division-row" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}<div className="drawer-status"><span>Status pembayaran</span><Badge tone="red">Belum Lunas</Badge></div></aside></div>}
  </main></div>;
}

function AdminTransactions({ role, back, logout }: { role: Role; back: () => void; logout: () => void }) {
  const [detail, setDetail] = useState<typeof transactions[0] | null>(null);
  return <div className="app-shell"><AppHeader role={role} title="Transaksi" onBack={back} onLogout={logout} /><main className="content"><PageTitle eyebrow="Admin • Hanya lihat" title="Transaksi Masuk" desc="Data transaksi otomatis diterima dari kasir untuk persiapan paket." />
    <section className="filter-bar simple"><div className="search-box"><Icon name="search" /><input placeholder="Cari nomor atau customer" /></div><Badge tone="neutral">Hanya lihat</Badge></section>
    <section className="table-panel"><div className="table-wrap"><table><thead><tr><th>No. Transaksi</th><th>Customer</th><th>Tanggal Acara</th><th>Paket yang Diambil</th><th>Status Bayar</th><th /></tr></thead><tbody>{transactions.map((t) => <tr key={t.no} onClick={() => setDetail(t)}><td><strong>{t.no}</strong></td><td><strong>{t.customer}</strong><small className="cell-sub">{t.phone}</small></td><td>{t.date}</td><td>{t.packages}</td><td><Badge tone={t.status === "Lunas" ? "green" : "red"}>{t.status}</Badge></td><td><Icon name="chevron" size={17} /></td></tr>)}</tbody></table></div></section>
    {detail && <div className="drawer-backdrop" onClick={() => setDetail(null)}><aside className="detail-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setDetail(null)}>×</button><Badge tone="neutral">Hanya lihat</Badge><h2>{detail.customer}</h2><p>{detail.no} • {detail.date}</p><h3>Persiapan per divisi</h3>{detail.packages.split(", ").map((p, i) => <div className="division-row" key={p}><span>{["Dekorasi", "Rias / MUA", "Dokumentasi", "Hiburan"][i] || "Lainnya"}</span><strong>{p}</strong></div>)}<div className="drawer-status"><span>Status pembayaran</span><Badge tone={detail.status === "Lunas" ? "green" : "red"}>{detail.status}</Badge></div></aside></div>}
  </main></div>;
}

function PackageManagement({ role, packages, setPackages, back, logout }: { role: Role; packages: PackageItem[]; setPackages: React.Dispatch<React.SetStateAction<PackageItem[]>>; back: () => void; logout: () => void }) {
  const [category, setCategory] = useState("Semua");
  const [editing, setEditing] = useState<PackageItem | null>(null);
  const [adding, setAdding] = useState(false);
  const displayed = category === "Semua" ? packages : packages.filter((p) => p.category === category);
  const savePackage = () => {
    if (editing) setPackages((list) => list.map((p) => p.code === editing.code ? editing : p));
    else setPackages((list) => [...list, { code: `NEW-${String(list.length + 1).padStart(2, "0")}`, name: "Paket Wedding Baru", category: "Dekorasi", price: 12000000, quota: 3, used: 0, active: true, desc: "Deskripsi paket baru" }]);
    setEditing(null); setAdding(false);
  };
  return <div className="app-shell"><AppHeader role={role} title="Kelola Paket" onBack={back} onLogout={logout} /><main className="content"><div className="title-with-action"><PageTitle eyebrow="Admin • Master Data" title="Kelola Paket" desc="Perubahan paket langsung tersedia di pilihan kasir." /><Button onClick={() => setAdding(true)}><Icon name="plus" size={18} /> Tambah Paket</Button></div>
    <div className="package-admin-toolbar"><div className="category-tabs compact">{["Semua", "Dekorasi", "MUA", "Rias Adat Sunda", "Fotografer", "Catering", "Vendor Lain"].map((c) => <button className={category === c ? "active" : ""} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div></div>
    <section className="table-panel"><div className="table-wrap"><table><thead><tr><th>Kode</th><th>Nama Paket</th><th>Kategori</th><th>Harga</th><th>Kuota / hari</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{displayed.map((p) => <tr key={p.code} className={!p.active ? "inactive-row" : ""}><td><strong>{p.code}</strong></td><td><strong>{p.name}</strong><small className="cell-sub">{p.desc}</small></td><td>{p.category}</td><td className="tabular">{p.price ? money(p.price) : <span className="missing-price">Belum diisi</span>}</td><td>{p.quota} booking</td><td><Badge tone={p.active ? "green" : "neutral"}>{p.active ? "Aktif" : "Nonaktif"}</Badge></td><td><div className="row-actions"><button onClick={() => setEditing(p)}><Icon name="edit" size={16} /> Edit</button><button className={p.active ? "danger-text" : ""} onClick={() => setPackages((list) => list.map((x) => x.code === p.code ? { ...x, active: !x.active } : x))}>{p.active ? "Nonaktifkan" : "Aktifkan"}</button></div></td></tr>)}</tbody></table></div></section>
    {(editing || adding) && <div className="modal-backdrop"><div className="package-modal"><button className="drawer-close" onClick={() => { setEditing(null); setAdding(false); }}>×</button><span className="eyebrow">{editing ? "Edit paket" : "Paket baru"}</span><h2>{editing ? editing.name : "Tambah Paket Wedding"}</h2><div className="form-grid"><label>Kategori<select value={editing?.category || "Dekorasi"} onChange={(e) => editing && setEditing({ ...editing, category: e.target.value })}><option>Dekorasi</option><option>MUA</option><option>Rias Adat Sunda</option><option>Fotografer</option><option>Catering</option><option>Vendor Lain</option></select></label><label>Nama paket<input value={editing?.name || "Paket Wedding Baru"} onChange={(e) => editing && setEditing({ ...editing, name: e.target.value })} /></label><label className="full">Deskripsi<textarea value={editing?.desc || "Deskripsi paket baru"} onChange={(e) => editing && setEditing({ ...editing, desc: e.target.value })} /></label><label>Harga<input type="number" value={editing?.price || 12000000} onChange={(e) => editing && setEditing({ ...editing, price: Number(e.target.value) })} /></label><label>Kuota per hari<input type="number" value={editing?.quota || 3} onChange={(e) => editing && setEditing({ ...editing, quota: Number(e.target.value) })} /></label></div><div className="info-note"><Icon name="history" /><div><strong>Harga tersimpan saat transaksi</strong><span>Perubahan harga tidak memengaruhi transaksi lama.</span></div></div><div className="modal-actions"><Button variant="ghost" onClick={() => { setEditing(null); setAdding(false); }}>Batal</Button><Button onClick={savePackage}>Simpan Paket</Button></div></div></div>}
  </main></div>;
}

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [role, setRole] = useState<Role>("kasir");
  const [packages, setPackages] = useState(initialPackages);
  const login = () => setPage("menu");
  const logout = () => setPage("login");
  const back = () => setPage("menu");
  const screen = useMemo(() => {
    if (page === "login") return <Login role={role} setRole={setRole} onLogin={login} />;
    if (page === "menu") return <MainMenu role={role} navigate={setPage} logout={logout} />;
    if (page === "transaction") return <TransactionWizard role={role} packages={packages} back={back} logout={logout} />;
    if (page === "payment") return <PaymentPage role={role} back={back} logout={logout} />;
    if (page === "history") return <HistoryPage role={role} back={back} logout={logout} />;
    if (page === "schedule") return <SchedulePage role={role} back={back} logout={logout} />;
    if (page === "adminTransactions") return <AdminTransactions role={role} back={back} logout={logout} />;
    if (page === "packages") return <PackageManagement role={role} packages={packages} setPackages={setPackages} back={back} logout={logout} />;
    return null;
  }, [page, role, packages]);
  return screen;
}
