CREATE TABLE orders (
  id                   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_id           INT REFERENCES accounts(id),
  status               VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  total_amount         INT NOT NULL,
  shipping_name        VARCHAR(255) NOT NULL,
  shipping_postal_code VARCHAR(20) NOT NULL,
  shipping_address     TEXT NOT NULL,
  shipping_phone       VARCHAR(20),
  note                 TEXT,
  del_flg              BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id     INT NOT NULL REFERENCES orders(id),
  product_id   INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  unit_price   INT NOT NULL,
  quantity     INT NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
