-- accountsに認証用のカラムを追加
ALTER TABLE accounts ADD COLUMN password VARCHAR NOT NULL;

-- ロールマスタ
CREATE TABLE IF NOT EXISTS roles (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- アカウントとロールの中間テーブル
CREATE TABLE IF NOT EXISTS account_roles (
  account_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY(account_id, role_id),
  CONSTRAINT fk_account_roles_account
    FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_account_roles_role
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
);

INSERT INTO roles (name) VALUES ('ADMIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('USER')  ON CONFLICT (name) DO NOTHING;