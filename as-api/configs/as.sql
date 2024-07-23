-- ----------------------------
-- Table structures for ZH Account System
-- ----------------------------

CREATE DATABASE IF NOT EXISTS `asdb`;
USE `asdb`;

DROP TABLE IF EXISTS `as_expenditure`;
CREATE TABLE `as_expenditure`
(
    `id`         bigint unsigned  NOT NULL AUTO_INCREMENT,
    `vehicle_id` bigint unsigned NOT NULL COMMENT '车辆 ID',
    `type`       tinyint unsigned NOT NULL COMMENT '支出类型',
    `cost`       int unsigned NOT NULL COMMENT '费用',
    `expend_at`  date NOT NULL DEFAULT (current_date()) COMMENT '支出时间',
    `comment`    varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '创建时间',
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '修改时间',
    PRIMARY KEY (`id`),
    KEY `idx_vehicle_type_time` (`vehicle_id`,`type`,`expend_at`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `as_project`;
CREATE TABLE `as_project`
(
    `id`         bigint unsigned NOT NULL AUTO_INCREMENT,
    `name`       varchar(64) NOT NULL DEFAULT '' COMMENT '项目名称',
    `start_at`   date        NOT NULL DEFAULT (current_date()) COMMENT '开始时间',
    `end_at`     date        NOT NULL DEFAULT (current_date()) COMMENT '结束时间',
    `status`     tinyint unsigned NOT NULL DEFAULT 0 COMMENT '状态',
    `comment`    varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
    `created_at` timestamp   NOT NULL DEFAULT current_timestamp() COMMENT '创建时间',
    `updated_at` timestamp   NOT NULL DEFAULT current_timestamp() COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `as_vehicle`;
CREATE TABLE `as_vehicle`
(
    `id`         bigint unsigned NOT NULL AUTO_INCREMENT,
    `number`     varchar(7)  NOT NULL DEFAULT '' COMMENT '车牌号',
    `brand`      varchar(64) NOT NULL DEFAULT '' COMMENT '品牌',
    `status`     tinyint unsigned NOT NULL DEFAULT 0 COMMENT '状态',
    `comment`    varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
    `created_at` timestamp   NOT NULL DEFAULT current_timestamp() COMMENT '创建时间',
    `updated_at` timestamp   NOT NULL DEFAULT current_timestamp() COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `as_driver`;
CREATE TABLE `as_driver`
(
    `id`         bigint unsigned NOT NULL AUTO_INCREMENT,
    `name`       varchar(16)  NOT NULL DEFAULT '' COMMENT '姓名',
    `phone`      varchar(11)  NOT NULL DEFAULT '' COMMENT '电话',
    `address`    varchar(128) NOT NULL DEFAULT '' COMMENT '电话',
    `status`     tinyint unsigned NOT NULL DEFAULT 0 COMMENT '状态',
    `comment`    varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
    `created_at` timestamp    NOT NULL DEFAULT current_timestamp() COMMENT '创建时间',
    `updated_at` timestamp    NOT NULL DEFAULT current_timestamp() COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `as_order`;
CREATE TABLE `as_order`
(
    `id`         bigint unsigned NOT NULL AUTO_INCREMENT,
    `project_id` bigint unsigned NOT NULL COMMENT '项目 ID',
    `vehicle_id` bigint unsigned NOT NULL COMMENT '车辆 ID',
    `driver_id`  bigint unsigned NOT NULL COMMENT '司机 ID',
    `load_at`    date NOT NULL DEFAULT (current_date()) COMMENT '装车时间',
    `unload_at`  date NOT NULL DEFAULT (current_date()) COMMENT '卸车时间',
    `mileage`    mediumint unsigned NOT NULL DEFAULT 0 COMMENT '里程',
    `freight`    mediumint unsigned NOT NULL DEFAULT 0 COMMENT '运费',
    `payroll`    mediumint unsigned NOT NULL DEFAULT 0 COMMENT '工资',
    `weight`     smallint unsigned NOT NULL DEFAULT 0 COMMENT '载重',
    `status`     tinyint unsigned NOT NULL DEFAULT 0 COMMENT '状态',
    `comment`    varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
    `created_at` timestamp    NOT NULL DEFAULT current_timestamp() COMMENT '创建时间',
    `updated_at` timestamp    NOT NULL DEFAULT current_timestamp() COMMENT '修改时间',
    PRIMARY KEY (`id`),
    KEY `idx_vehicle_time` (`vehicle_id`,`unload_at`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
