CREATE TABLE IF NOT EXISTS tenants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  primary_domain VARCHAR(255) NULL,
  status ENUM('Active', 'Suspended', 'Cancelled') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_tenants_status_created_at (status, created_at)
);

CREATE TABLE IF NOT EXISTS customer_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id BIGINT UNSIGNED NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('Customer', 'TenantAdmin') NOT NULL DEFAULT 'Customer',
  referred_by VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY customer_users_email_key (email),
  INDEX idx_customer_users_tenant_last_active (tenant_id, last_active),
  CONSTRAINT fk_customer_users_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customer_subscriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id BIGINT UNSIGNED NOT NULL,
  plan ENUM('Free', 'Pro', 'Enterprise') NOT NULL DEFAULT 'Free',
  status ENUM('Active', 'Cancelled', 'Expired', 'PastDue') NOT NULL DEFAULT 'Active',
  payment_provider VARCHAR(80) NULL,
  provider_ref VARCHAR(160) NULL,
  amount_cents INT UNSIGNED NULL,
  currency VARCHAR(12) NOT NULL DEFAULT 'INR',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_customer_subscriptions_tenant_status (tenant_id, status, created_at),
  CONSTRAINT fk_customer_subscriptions_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usage_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  tool_slug VARCHAR(120) NOT NULL,
  tool_name VARCHAR(255) NULL,
  status ENUM('Success', 'Failed') NOT NULL DEFAULT 'Success',
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_usage_events_tenant_created_at (tenant_id, created_at),
  INDEX idx_usage_events_tool_created_at (tool_slug, created_at),
  CONSTRAINT fk_usage_events_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_usage_events_user_id
    FOREIGN KEY (user_id)
    REFERENCES customer_users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id BIGINT UNSIGNED NULL,
  target_user_id BIGINT UNSIGNED NULL,
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(120) NOT NULL,
  notes TEXT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_admin_actions_admin_created_at (admin_email, created_at),
  INDEX idx_admin_actions_tenant_created_at (tenant_id, created_at),
  CONSTRAINT fk_admin_actions_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_admin_actions_target_user_id
    FOREIGN KEY (target_user_id)
    REFERENCES customer_users(id)
    ON DELETE SET NULL
);
