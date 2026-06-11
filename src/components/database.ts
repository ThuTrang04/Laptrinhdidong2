// ================================================================
// FILE: database.ts
// Dùng expo-sqlite — tương thích với Expo Go, không cần build native
// ================================================================

import * as SQLite from 'expo-sqlite';

// ================================================================
// getDb() — Mở kết nối database
// SQLite.openDatabaseSync(): mở file myDatabase.db trên thiết bị
// Nếu file chưa tồn tại → tự tạo mới
// ================================================================
const getDb = () => {
  return SQLite.openDatabaseSync('myDatabase.db');
};

// ================================================================
// ĐỊNH NGHĨA KIỂU DỮ LIỆU
// ================================================================
export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
  description: string; // Mô tả sản phẩm — thêm mới
};

// ================================================================
// IMAGE_MAP — Ánh xạ tên file → require() ảnh local
//
// Tại sao cần map này?
//   - SQLite chỉ lưu được STRING (văn bản), không lưu được file ảnh
//   - Nên ta lưu TÊN FILE vào cột img trong database
//   - Khi hiển thị, dùng tên file để tìm ảnh tương ứng trong map này
//
// Cách thêm ảnh mới:
//   1. Bỏ file ảnh vào thư mục src/assets/
//   2. Thêm 1 dòng vào IMAGE_MAP bên dưới:
//      'ten_file.jpg': require('../assets/ten_file.jpg'),
//   3. Trong initialProducts, đặt img: 'ten_file.jpg'
// ================================================================
const IMAGE_MAP: { [key: string]: any } = {
  'ao_thun_tay_lo.jpeg':        require('../assets/ao_thun_tay_lo_form_rong_tsun_28c6772fbfb54500982f5fd7d62c0799.jpeg'),
  'ao_len_chan_vay.jpg':         require('../assets/Ao-Len-Va-Chan-Vay.jpg'),
  'ao_thun_nu_kem.webp':         require('../assets/ao-thun-nu-tay-ngan-mau-kem-in-hinh-asm18-18.webp'),
  'ao_tre_vai.webp':             require('../assets/ao-tre-vai.webp'),
  'ao_thun_nu_form_rong.jpg':    require('../assets/Aothunnuformrong.jpg'),
  'ao_tre_vai_nu_xinh.jpg':      require('../assets/aotrevainuxinh.jpg'),
  'bo_set_vay.webp':             require('../assets/bosetvay.webp'),
  'bo_vay.jpg':                  require('../assets/Bovay.jpg'),
  'ao_thun_form_rong_nu.jpg':    require('../assets/cac-kieu-ao-thun-form-rong-nu-2-1.jpg'),
  'chan_vay_nu.webp':            require('../assets/chan-vay-nu.webp'),
  'do_hot_mua_he.webp':          require('../assets/Đo-hot-mua-he.webp'),
  'phoi_do_ao_thun_rong.jpg':    require('../assets/phoi-do-voi-ao-thun-form-rong-nu-24.jpg'),
  'phoi_do_rong.jpg':            require('../assets/phoi-do-voi-ao-thun-rong.jpg'),
  'phoi_do_dep.jpg':             require('../assets/phoidodep.jpg'),
  'thoi_trang_nu_2023.jpg':      require('../assets/thoi-trang-nu-2023-38.jpg'),
  'thoi_trang_nu.jpg':           require('../assets/thoi-trang-nu.jpg'),
  'thoi_trang_hot_2026.jpg':     require('../assets/thoitranghot2026c.jpg'),
  'vay_hong.webp':               require('../assets/vayhong.webp'),
  'vay_tre_vai.jpg':             require('../assets/Vaytrevai.jpg'),
};

// ================================================================
// getImage() — Lấy source ảnh từ tên file
// Dùng khi: truyền vào <Image source={getImage(item.img)} />
// Nếu không tìm thấy → trả về null (hiện placeholder)
// ================================================================
export const getImage = (filename: string) => {
  return IMAGE_MAP[filename] || null;
};

const initialCategories: Category[] = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Váy' },
  { id: 3, name: 'Bộ Set' },
  { id: 4, name: 'Phối đồ' },
  { id: 5, name: 'Xu hướng' },
  { id: 6, name: 'Kính' },
  { id: 7, name: 'Bộ Sét Váy' },
];

// ================================================================
// initialProducts — Dữ liệu sản phẩm mẫu
// Trường img: đặt ĐÚNG tên key trong IMAGE_MAP ở trên
// Ví dụ: img: 'ao_thun_nu_kem.webp' → hiển thị ảnh ao-thun-nu-tay-ngan...webp
// ================================================================
const initialProducts: Product[] = [
  { id: 1,  name: 'Áo Thun Tay Lỡ Form Rộng',  price: 150000, img: 'ao_thun_tay_lo.jpeg',       categoryId: 1, description: 'Áo thun tay lỡ form rộng, chất liệu cotton thoáng mát, phù hợp mọi dịp.' },
  { id: 2,  name: 'Áo Len + Chân Váy',          price: 320000, img: 'ao_len_chan_vay.jpg',        categoryId: 3, description: 'Bộ set áo len kết hợp chân váy thanh lịch, phù hợp dạo phố và đi làm.' },
  { id: 3,  name: 'Áo Thun Nữ Màu Kem',         price: 130000, img: 'ao_thun_nu_kem.webp',        categoryId: 1, description: 'Áo thun nữ màu kem nhẹ nhàng, dễ phối đồ, chất liệu mềm mịn.' },
  { id: 4,  name: 'Áo Trễ Vai Nữ',              price: 140000, img: 'ao_tre_vai.webp',            categoryId: 1, description: 'Áo trễ vai nữ sexy và thời trang, phù hợp mùa hè.' },
  { id: 5,  name: 'Áo Thun Form Rộng Nữ',       price: 120000, img: 'ao_thun_nu_form_rong.jpg',   categoryId: 1, description: 'Áo thun form rộng thoải mái, phong cách unisex trẻ trung.' },
  { id: 6,  name: 'Áo Trễ Vai Xinh',            price: 155000, img: 'ao_tre_vai_nu_xinh.jpg',     categoryId: 1, description: 'Áo trễ vai xinh xắn, thiết kế tinh tế nổi bật.' },
  { id: 7,  name: 'Bộ Set Váy Nữ',              price: 350000, img: 'bo_set_vay.webp',            categoryId: 3, description: 'Bộ set váy nữ đồng bộ, sang trọng và dễ mặc.' },
  { id: 8,  name: 'Bộ Váy Dạo Phố',             price: 280000, img: 'bo_vay.jpg',                 categoryId: 3, description: 'Bộ váy dạo phố năng động, thoải mái và thời trang.' },
  { id: 9,  name: 'Áo Thun Form Rộng Kiểu',     price: 135000, img: 'ao_thun_form_rong_nu.jpg',   categoryId: 1, description: 'Áo thun form rộng kiểu cách, in hình độc đáo.' },
  { id: 10, name: 'Chân Váy Nữ Dễ Thương',      price: 180000, img: 'chan_vay_nu.webp',            categoryId: 2, description: 'Chân váy nữ dễ thương, dễ phối với nhiều loại áo.' },
  { id: 11, name: 'Đồ Hot Mùa Hè',              price: 250000, img: 'do_hot_mua_he.webp',         categoryId: 5, description: 'Trang phục hot nhất mùa hè, màu sắc tươi sáng nổi bật.' },
  { id: 12, name: 'Set Phối Áo Thun Rộng',      price: 290000, img: 'phoi_do_ao_thun_rong.jpg',   categoryId: 4, description: 'Gợi ý phối đồ với áo thun rộng cực trendy.' },
  { id: 13, name: 'Phối Đồ Áo Thun Rộng',       price: 270000, img: 'phoi_do_rong.jpg',           categoryId: 4, description: 'Cách phối đồ sáng tạo với áo thun form rộng.' },
  { id: 14, name: 'Phối Đồ Đẹp Trendy',         price: 310000, img: 'phoi_do_dep.jpg',            categoryId: 4, description: 'Phong cách phối đồ trendy 2025, sang chảnh mà đơn giản.' },
  { id: 15, name: 'Thời Trang Nữ 2023',         price: 220000, img: 'thoi_trang_nu_2023.jpg',     categoryId: 5, description: 'Xu hướng thời trang nữ nổi bật năm 2023.' },
  { id: 16, name: 'Thời Trang Nữ Cơ Bản',       price: 195000, img: 'thoi_trang_nu.jpg',          categoryId: 5, description: 'Trang phục nữ cơ bản không bao giờ lỗi mốt.' },
  { id: 17, name: 'Hot Trend 2026',              price: 340000, img: 'thoi_trang_hot_2026.jpg',    categoryId: 5, description: 'Xu hướng thời trang nóng nhất năm 2026.' },
  { id: 18, name: 'Váy Hồng Xinh Xắn',          price: 260000, img: 'vay_hong.webp',              categoryId: 2, description: 'Váy hồng ngọt ngào xinh xắn, lý tưởng cho mùa xuân.' },
  { id: 19, name: 'Váy Trễ Vai Nữ',             price: 230000, img: 'vay_tre_vai.jpg',            categoryId: 2, description: 'Váy trễ vai nữ quyến rũ, thích hợp đi chơi và sự kiện.' },
];

// ================================================================
// initDatabase() — Tạo bảng + chèn dữ liệu mặc định
// Gọi 1 lần trong useEffect khi app khởi động
// onSuccess: callback gọi sau khi xong để load dữ liệu lên màn hình
// ================================================================
export const initDatabase = (onSuccess?: () => void): void => {
  try {
    const db = getDb();

    db.withTransactionSync(() => {
      // Tạo bảng categories nếu chưa có
      db.runSync('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT)');
      initialCategories.forEach((cat) => {
        db.runSync('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [cat.id, cat.name]);
      });

      // Tạo bảng products nếu chưa có
      db.runSync(`
        CREATE TABLE IF NOT EXISTS products (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          name        TEXT,
          price       REAL,
          img         TEXT,
          categoryId  INTEGER,
          description TEXT DEFAULT '',
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )
      `);
      // Thêm cột description nếu bảng cũ chưa có (migrate)
      try {
        db.runSync('ALTER TABLE products ADD COLUMN description TEXT DEFAULT ""');
      } catch (_) { /* Cột đã tồn tại, bỏ qua */ }

      initialProducts.forEach((p) => {
        db.runSync(
          'INSERT OR IGNORE INTO products (id, name, price, img, categoryId, description) VALUES (?, ?, ?, ?, ?, ?)',
          [p.id, p.name, p.price, p.img, p.categoryId, p.description]
        );
        db.runSync(
          "UPDATE products SET img = ? WHERE id = ? AND (img = '' OR img IS NULL)",
          [p.img, p.id]
        );
        // Cập nhật description cho sản phẩm đã có nhưng description rỗng
        db.runSync(
          "UPDATE products SET description = ? WHERE id = ? AND (description = '' OR description IS NULL)",
          [p.description, p.id]
        );
      });
    });

    console.log('✅ Database initialized');
    // Tạo các bảng liên quan đến users, orders và giỏ hàng
    initUserTable();
    initOrderAndCartTables();
    if (onSuccess) onSuccess();

  } catch (error) {
    console.error('❌ initDatabase error:', error);
  }
};

// ================================================================
// fetchCategories() — Lấy tất cả danh mục
// getAllSync(): truy vấn đồng bộ, trả về mảng kết quả ngay lập tức
// ================================================================
export const fetchCategories = (): Category[] => {
  try {
    const db = getDb();
    // ORDER BY id DESC: danh mục mới thêm sẽ hiển thị đầu tiên
    return db.getAllSync<Category>('SELECT * FROM categories ORDER BY id DESC');
  } catch (error) {
    console.error('❌ fetchCategories error:', error);
    return [];
  }
};

// ================================================================
// addCategory() — Thêm danh mục mới (admin)
// ================================================================
export const addCategory = (name: string): void => {
  try {
    const db = getDb();
    db.runSync('INSERT INTO categories (name) VALUES (?)', [name]);
    console.log('✅ Category added:', name);
  } catch (error) {
    console.error('❌ addCategory error:', error);
  }
};

// ================================================================
// updateCategory() — Sửa danh mục (admin)
// ================================================================
export const updateCategory = (id: number, name: string): void => {
  try {
    const db = getDb();
    db.runSync('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    console.log('✅ Category updated:', id);
  } catch (error) {
    console.error('❌ updateCategory error:', error);
  }
};

// ================================================================
// deleteCategory() — Xóa danh mục (admin)
// ================================================================
export const deleteCategory = (id: number): void => {
  try {
    const db = getDb();
    db.runSync('DELETE FROM categories WHERE id = ?', [id]);
    console.log('✅ Category deleted:', id);
  } catch (error) {
    console.error('❌ deleteCategory error:', error);
  }
};

// ================================================================
// fetchProducts() — Lấy tất cả sản phẩm
// ================================================================
export const fetchProducts = (): Product[] => {
  try {
    const db = getDb();
    return db.getAllSync<Product>('SELECT * FROM products ORDER BY id DESC');
  } catch (error) {
    console.error('❌ fetchProducts error:', error);
    return [];
  }
};

// ================================================================
// addProduct() — Thêm sản phẩm mới
// Omit<Product, 'id'>: không cần truyền id (tự tăng AUTOINCREMENT)
// ================================================================
export const addProduct = (product: Omit<Product, 'id'>): void => {
  try {
    const db = getDb();
    db.runSync(
      'INSERT INTO products (name, price, img, categoryId, description) VALUES (?, ?, ?, ?, ?)',
      [product.name, product.price, product.img, product.categoryId, product.description || '']
    );
    console.log('✅ Product added');
  } catch (error) {
    console.error('❌ addProduct error:', error);
  }
};

// ================================================================
// updateProduct() — Cập nhật sản phẩm theo id
// ================================================================
export const updateProduct = (product: Product): void => {
  try {
    const db = getDb();
    db.runSync(
      'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ?, description = ? WHERE id = ?',
      [product.name, product.price, product.categoryId, product.img, product.description || '', product.id]
    );
    console.log('✅ Product updated');
  } catch (error) {
    console.error('❌ updateProduct error:', error);
  }
};

// ================================================================
// deleteProduct() — Xóa sản phẩm theo id
// ================================================================
export const deleteProduct = (id: number): void => {
  try {
    const db = getDb();
    db.runSync('DELETE FROM products WHERE id = ?', [id]);
    console.log('✅ Product deleted');
  } catch (error) {
    console.error('❌ deleteProduct error:', error);
  }
};

// ================================================================
// searchProductsByNameOrCategory() — Tìm theo tên hoặc danh mục
// LIKE '%keyword%': tìm chuỗi chứa keyword
// JOIN: kết hợp 2 bảng để tìm được theo tên danh mục
// ================================================================
export const searchProductsByNameOrCategory = (keyword: string): Product[] => {
  try {
    const db = getDb();
    return db.getAllSync<Product>(
      `SELECT products.* FROM products
       JOIN categories ON products.categoryId = categories.id
       WHERE products.name LIKE ? OR categories.name LIKE ?
       ORDER BY products.id DESC`,
      [`%${keyword}%`, `%${keyword}%`]
    );
  } catch (error) {
    console.error('❌ searchProducts error:', error);
    return [];
  }
};

// ================================================================
// KIỂU DỮ LIỆU USER
// ================================================================
export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  fullName?: string;
  phone?: string;
  address?: string;
  bio?: string;       // Tiểu sử
  gender?: string;    // Giới tính: 'Nam' | 'Nữ' | 'Khác'
  birthday?: string;  // Ngày sinh: định dạng DD/MM/YYYY
  avatar?: string;    // Đường dẫn ảnh đại diện (URI)
};

// ================================================================
// initUserTable() — Tạo bảng users nếu chưa có
// Gọi trong initDatabase() để đảm bảo bảng tồn tại
// ================================================================
export const initUserTable = (): void => {
  try {
    const db = getDb();
    db.runSync(`
      CREATE TABLE IF NOT EXISTS users (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,  -- UNIQUE: không cho trùng username
        password TEXT,
        role     TEXT,
        fullName TEXT DEFAULT '',
        phone    TEXT DEFAULT '',
        address  TEXT DEFAULT ''
      )
    `);

    // Thực hiện di chuyển bảng (migration) trong trường hợp database cũ chưa có cột mới
    try { db.runSync("ALTER TABLE users ADD COLUMN fullName TEXT DEFAULT ''"); } catch (_) {}
    try { db.runSync("ALTER TABLE users ADD COLUMN phone TEXT DEFAULT ''"); } catch (_) {}
    try { db.runSync("ALTER TABLE users ADD COLUMN address TEXT DEFAULT ''"); } catch (_) {}
    try { db.runSync("ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''"); } catch (_) {}
    try { db.runSync("ALTER TABLE users ADD COLUMN gender TEXT DEFAULT ''"); } catch (_) {}
    try { db.runSync("ALTER TABLE users ADD COLUMN birthday TEXT DEFAULT ''"); } catch (_) {}
    try { db.runSync("ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT ''"); } catch (_) {}

    // Khởi tạo tài khoản admin mặc định: admin / admin123
    db.runSync(`
      INSERT OR IGNORE INTO users (username, password, role, fullName)
      VALUES (?, ?, ?, ?)
    `, ['admin', 'admin123', 'admin', 'Quản trị viên']);

    console.log('✅ Users table ready with admin account initialized');
  } catch (error) {
    console.error('❌ initUserTable error:', error);
  }
};

// ================================================================
// registerUser() — Đăng ký tài khoản mới
// ================================================================
export const registerUser = (username: string, password: string, phone: string = ''): { success: boolean; message?: string } => {
  try {
    const db = getDb();
    const existing = db.getFirstSync<User>(
      'SELECT * FROM users WHERE username = ?', [username]
    );
    if (existing) {
      return { success: false, message: 'Tên đăng nhập đã tồn tại' };
    }
    // Lưu phone ngay khi đăng ký nếu có
    db.runSync(
      'INSERT INTO users (username, password, role, fullName, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [username, password, 'user', '', phone, '']
    );
    console.log('✅ User registered:', username);
    return { success: true };
  } catch (error) {
    console.error('❌ registerUser error:', error);
    return { success: false, message: 'Lỗi hệ thống' };
  }
};

// ================================================================
// loginUser() — Đăng nhập
// ================================================================
export const loginUser = (username: string, password: string): User | null => {
  try {
    const db = getDb();
    // So khớp cả username VÀ password
    const user = db.getFirstSync<User>(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    return user ?? null;
  } catch (error) {
    console.error('❌ loginUser error:', error);
    return null;
  }
};

// ================================================================
// fetchUsers() — Lấy danh sách tất cả tài khoản
// ================================================================
export const fetchUsers = (): User[] => {
  try {
    const db = getDb();
    return db.getAllSync<User>('SELECT * FROM users');
  } catch (error) {
    console.error('❌ fetchUsers error:', error);
    return [];
  }
};

// ================================================================
// updateUserRole() — Thay đổi vai trò người dùng (admin)
// ================================================================
export const updateUserRole = (id: number, role: string): void => {
  try {
    const db = getDb();
    db.runSync('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    console.log('✅ User role updated:', id, '->', role);
  } catch (error) {
    console.error('❌ updateUserRole error:', error);
  }
};

// ================================================================
// updateUserInfo() — Cập nhật thông tin nhận hàng
// ================================================================
export const updateUserInfo = (id: number, fullName: string, phone: string, address: string): void => {
  try {
    const db = getDb();
    db.runSync(
      'UPDATE users SET fullName = ?, phone = ?, address = ? WHERE id = ?',
      [fullName, phone, address, id]
    );
    console.log('✅ User info updated:', id);
  } catch (error) {
    console.error('❌ updateUserInfo error:', error);
  }
};

// ================================================================
// deleteUser() — Xóa người dùng (admin)
// ================================================================
export const deleteUser = (id: number): void => {
  try {
    const db = getDb();
    db.runSync('DELETE FROM users WHERE id = ?', [id]);
    console.log('✅ User deleted:', id);
  } catch (error) {
    console.error('❌ deleteUser error:', error);
  }
};

// ================================================================
// fetchUserById() — Lấy thông tin user bằng ID
// ================================================================
export const fetchUserById = (id: number): User | null => {
  try {
    const db = getDb();
    const user = db.getFirstSync<User>('SELECT * FROM users WHERE id = ?', [id]);
    return user ?? null;
  } catch (error) {
    console.error('❌ fetchUserById error:', error);
    return null;
  }
};

// ================================================================
// KIỂU DỮ LIỆU ĐƠN HÀNG (ORDER)
// ================================================================
export type Order = {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImg: string;
  quantity: number;
  recipientName: string;
  phone: string;
  address: string;
  orderDate: string;
  status: string; // 'Chờ xác nhận' | 'Đang giao' | 'Đã nhận'
};

// ================================================================
// initOrderAndCartTables() — Khởi tạo bảng orders và cart
// ================================================================
export const initOrderAndCartTables = (): void => {
  try {
    const db = getDb();
    db.withTransactionSync(() => {
      // Bảng đơn hàng
      db.runSync(`
        CREATE TABLE IF NOT EXISTS orders (
          id             INTEGER PRIMARY KEY AUTOINCREMENT,
          userId         INTEGER,
          productId      INTEGER,
          productName    TEXT,
          productPrice   REAL,
          productImg     TEXT,
          quantity       INTEGER,
          recipientName  TEXT,
          phone          TEXT,
          address        TEXT,
          orderDate      TEXT,
          status         TEXT DEFAULT 'Chờ xác nhận'
        )
      `);

      // Bảng giỏ hàng
      db.runSync(`
        CREATE TABLE IF NOT EXISTS cart (
          id        INTEGER PRIMARY KEY AUTOINCREMENT,
          userId    INTEGER,
          productId INTEGER,
          quantity  INTEGER
        )
      `);
    });
    console.log('✅ Orders and Cart tables initialized');
  } catch (error) {
    console.error('❌ initOrderAndCartTables error:', error);
  }
};

// ================================================================
// addOrder() — Tạo đơn hàng mới
// ================================================================
export const addOrder = (order: Omit<Order, 'id'>): void => {
  try {
    const db = getDb();
    db.runSync(`
      INSERT INTO orders (userId, productId, productName, productPrice, productImg, quantity, recipientName, phone, address, orderDate, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      order.userId, order.productId, order.productName, order.productPrice, order.productImg,
      order.quantity, order.recipientName, order.phone, order.address, order.orderDate, order.status || 'Chờ xác nhận'
    ]);
    console.log('✅ Order created for user:', order.userId);
  } catch (error) {
    console.error('❌ addOrder error:', error);
  }
};

// ================================================================
// fetchAllOrders() — Lấy danh sách tất cả đơn hàng (admin)
// ================================================================
export const fetchAllOrders = (): Order[] => {
  try {
    const db = getDb();
    return db.getAllSync<Order>('SELECT * FROM orders ORDER BY id DESC');
  } catch (error) {
    console.error('❌ fetchAllOrders error:', error);
    return [];
  }
};

// ================================================================
// fetchOrdersByUserId() — Xem lịch sử mua hàng của user
// ================================================================
export const fetchOrdersByUserId = (userId: number): Order[] => {
  try {
    const db = getDb();
    return db.getAllSync<Order>('SELECT * FROM orders WHERE userId = ? ORDER BY id DESC', [userId]);
  } catch (error) {
    console.error('❌ fetchOrdersByUserId error:', error);
    return [];
  }
};

// ================================================================
// updateOrderStatus() — Cập nhật trạng thái đơn hàng (admin)
// ================================================================
export const updateOrderStatus = (orderId: number, status: string): void => {
  try {
    const db = getDb();
    db.runSync('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    console.log('✅ Order status updated:', orderId, '->', status);
  } catch (error) {
    console.error('❌ updateOrderStatus error:', error);
  }
};

// ================================================================
// KIỂU DỮ LIỆU GIỎ HÀNG (CART)
// ================================================================
export type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  productName?: string;
  productPrice?: number;
  productImg?: string;
};

// ================================================================
// fetchCartByUserId() — Lấy các mặt hàng trong giỏ của người dùng
// ================================================================
export const fetchCartByUserId = (userId: number): CartItem[] => {
  try {
    const db = getDb();
    return db.getAllSync<CartItem>(`
      SELECT cart.*, products.name as productName, products.price as productPrice, products.img as productImg
      FROM cart
      JOIN products ON cart.productId = products.id
      WHERE cart.userId = ?
    `, [userId]);
  } catch (error) {
    console.error('❌ fetchCartByUserId error:', error);
    return [];
  }
};

// ================================================================
// addToCart() — Thêm hoặc tăng số lượng sản phẩm trong giỏ
// ================================================================
export const addToCart = (userId: number, productId: number, quantity: number): void => {
  try {
    const db = getDb();
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existing = db.getFirstSync<{ id: number; quantity: number }>(
      'SELECT id, quantity FROM cart WHERE userId = ? AND productId = ?',
      [userId, productId]
    );

    if (existing) {
      db.runSync(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [existing.quantity + quantity, existing.id]
      );
      console.log('✅ Updated cart quantity');
    } else {
      db.runSync(
        'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      console.log('✅ Added to cart new item');
    }
  } catch (error) {
    console.error('❌ addToCart error:', error);
  }
};

// ================================================================
// updateCartQuantity() — Cập nhật số lượng trực tiếp trong giỏ
// ================================================================
export const updateCartQuantity = (userId: number, productId: number, quantity: number): void => {
  try {
    const db = getDb();
    db.runSync(
      'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?',
      [quantity, userId, productId]
    );
    console.log('✅ Cart quantity updated directly');
  } catch (error) {
    console.error('❌ updateCartQuantity error:', error);
  }
};

// ================================================================
// removeFromCart() — Xóa sản phẩm khỏi giỏ hàng
// ================================================================
export const removeFromCart = (userId: number, productId: number): void => {
  try {
    const db = getDb();
    db.runSync('DELETE FROM cart WHERE userId = ? AND productId = ?', [userId, productId]);
    console.log('✅ Item removed from cart');
  } catch (error) {
    console.error('❌ removeFromCart error:', error);
  }
};

// ================================================================
// clearCart() — Xóa sạch giỏ hàng (sau khi checkout)
// ================================================================
export const clearCart = (userId: number): void => {
  try {
    const db = getDb();
    db.runSync('DELETE FROM cart WHERE userId = ?', [userId]);
    console.log('✅ Cart cleared');
  } catch (error) {
    console.error('❌ clearCart error:', error);
  }
};


// ================================================================
// updateFullProfile() — Cập nhật đầy đủ hồ sơ người dùng
// Bao gồm: tên, tiểu sử, giới tính, ngày sinh, SĐT, ảnh đại diện
// ================================================================
export const updateFullProfile = (
  id: number,
  data: {
    fullName?: string;
    bio?: string;
    gender?: string;
    birthday?: string;
    phone?: string;
    avatar?: string;
  }
): void => {
  try {
    const db = getDb();
    db.runSync(
      `UPDATE users SET
        fullName = COALESCE(?, fullName),
        bio      = COALESCE(?, bio),
        gender   = COALESCE(?, gender),
        birthday = COALESCE(?, birthday),
        phone    = COALESCE(?, phone),
        avatar   = COALESCE(?, avatar)
       WHERE id = ?`,
      [
        data.fullName ?? null,
        data.bio      ?? null,
        data.gender   ?? null,
        data.birthday ?? null,
        data.phone    ?? null,
        data.avatar   ?? null,
        id,
      ]
    );
    console.log('✅ Full profile updated for user:', id);
  } catch (error) {
    console.error('❌ updateFullProfile error:', error);
  }
};
