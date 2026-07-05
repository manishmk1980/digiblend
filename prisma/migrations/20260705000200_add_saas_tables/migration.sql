CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  clerk_user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  plan ENUM('FREE', 'PRO') NOT NULL DEFAULT 'FREE',
  credit_balance INT NOT NULL DEFAULT 0,
  referral_code VARCHAR(64) NULL,
  referred_by VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_clerk_user_id_key (clerk_user_id),
  UNIQUE KEY users_referral_code_key (referral_code),
  INDEX idx_users_email (email),
  INDEX idx_users_plan_created_at (plan, created_at)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  razorpay_sub_id VARCHAR(255) NULL,
  status ENUM('ACTIVE', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY subscriptions_razorpay_sub_id_key (razorpay_sub_id),
  INDEX idx_subscriptions_user_status (user_id, status),
  CONSTRAINT fk_subscriptions_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  tool_slug VARCHAR(120) NOT NULL,
  used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_usage_logs_user_tool_used_at (user_id, tool_slug, used_at),
  CONSTRAINT fk_usage_logs_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS credit_packs (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  credits INT NOT NULL,
  price_inr INT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('PURCHASE', 'SPEND', 'REFERRAL_BONUS', 'ADMIN_GRANT') NOT NULL,
  amount INT NOT NULL,
  tool_slug VARCHAR(120) NULL,
  razorpay_payment_id VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_credit_transactions_user_created_at (user_id, created_at),
  CONSTRAINT fk_credit_transactions_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  file_type VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_knowledge_documents_user_created_at (user_id, created_at),
  CONSTRAINT fk_knowledge_documents_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

ALTER TABLE admin_actions
  ADD COLUMN admin_id INT NULL,
  ADD COLUMN saas_target_user_id INT NULL,
  ADD INDEX idx_admin_actions_admin_id_created_at (admin_id, created_at),
  ADD INDEX idx_admin_actions_saas_target_created_at (saas_target_user_id, created_at),
  ADD CONSTRAINT fk_admin_actions_admin_id
    FOREIGN KEY (admin_id)
    REFERENCES users(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_admin_actions_saas_target_user_id
    FOREIGN KEY (saas_target_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL;
