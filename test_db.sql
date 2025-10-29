/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 90300
 Source Host           : localhost:3306
 Source Schema         : geo_forecast_mis_db

 Target Server Type    : MySQL
 Target Server Version : 90300
 File Encoding         : 65001

 Date: 29/10/2025 12:57:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_bd
-- ----------------------------
DROP TABLE IF EXISTS `t_bd`;
CREATE TABLE `t_bd`  (
  `bd_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '标段表主键',
  `bd_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标段ID:唯一标识',
  `bdname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标段名称:标段名称',
  `bdcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标段编码:);标段编码',
  `xm_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '项目ID:项目ID',
  `xmcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '项目编码:项目编码',
  `xmname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '项目名称:项目名称',
  `jsdanwei` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '建设单位:建设单位',
  `sgdanwei` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '施工单位:施工单位',
  `jldanwei` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '监理单位:监理单位',
  `bd_start_kilo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标段开始里程:标段的开始里程值',
  `bd_stop_kilo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标段结束里程:标段的结束里程值',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`bd_pk`) USING BTREE,
  UNIQUE INDEX `uk_bd_id`(`bd_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '标段表';

-- ----------------------------
-- Records of t_bd
-- ----------------------------
BEGIN;
INSERT INTO `t_bd` VALUES (1, 'bd_001', '站前3标', NULL, NULL, NULL, '渝昆高铁引入昆明枢纽工程', '建设单位_渝昆高铁引入昆明枢纽工程', '施工单位_渝昆高铁引入昆明枢纽工程', NULL, NULL, NULL, '2025-10-24 00:45:07', '2025-10-24 18:53:51'), (2, 'bd_002', '先期开工段(中铁三局)', NULL, NULL, NULL, '盘兴铁路', '建设单位_盘兴铁路', '施工单位_盘兴铁路', NULL, NULL, NULL, '2025-10-24 18:49:43', '2025-10-24 18:50:50');
COMMIT;

-- ----------------------------
-- Table structure for t_dbbc
-- ----------------------------
DROP TABLE IF EXISTS `t_dbbc`;
CREATE TABLE `t_dbbc`  (
  `dbbc_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '地表补充主键',
  `dbbc_id` bigint(0) NULL DEFAULT NULL COMMENT '地表补充ID',
  `yb_pk` bigint(0) NULL DEFAULT NULL COMMENT '预报分段信息主键',
  `beginkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '开始里程值',
  `dbbc_length` decimal(10, 2) NULL DEFAULT NULL COMMENT '本次预报长度',
  `sjwydj` decimal(1, 0) NULL DEFAULT NULL COMMENT '设计围岩等级(1-6)',
  `dcyx` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '地层岩性描述',
  `dbry` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '地表岩溶描述',
  `tsdz` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '特殊地质产状描述',
  `rwdk` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '人为坑道描述',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '备注',
  `sjqk` decimal(1, 0) NULL DEFAULT NULL COMMENT '设计情况是否相符:1相符;2基本相符;3不符',
  `dzpj` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '地质评定',
  `addition` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '附件流水号序列',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '掌子面里程',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `monitordate` datetime(0) NULL DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`dbbc_pk`) USING BTREE,
  UNIQUE INDEX `uk_dbbc_id`(`dbbc_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '地表补充表';

-- ----------------------------
-- Records of t_dbbc
-- ----------------------------
BEGIN;
INSERT INTO `t_dbbc` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 12:34:22', '2025-10-28 12:34:22'), (2, 2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 12:34:22', '2025-10-28 12:34:22');
COMMIT;

-- ----------------------------
-- Table structure for t_dcbfs
-- ----------------------------
DROP TABLE IF EXISTS `t_dcbfs`;
CREATE TABLE `t_dcbfs`  (
  `dcbfs_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '电磁波反射主键',
  `dcbfs_id` bigint(0) NULL DEFAULT NULL COMMENT '电磁波数据ID',
  `wtf_pk` bigint(0) NULL DEFAULT NULL COMMENT '物探法主键',
  `cxnum` decimal(2, 0) NULL DEFAULT NULL COMMENT '测线数量:布置测线组数,不得超过2位整数',
  `pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '测线布置示意图',
  `sb_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '设备型号:如:SIR-20',
  `gzpl` decimal(3, 0) NULL DEFAULT NULL COMMENT '天线工作频率:单位Mhz,不超过3位整数',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`dcbfs_pk`) USING BTREE,
  UNIQUE INDEX `uk_dcbfs_id`(`dcbfs_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '电磁波反射数据表';

-- ----------------------------
-- Records of t_dcbfs
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_dcbfs_resultinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_dcbfs_resultinfo`;
CREATE TABLE `t_dcbfs_resultinfo`  (
  `dcbfs_resultinfo_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '电磁波反射-成果数据信息主键',
  `dcbfs_resultinfo_id` bigint(0) NULL DEFAULT NULL COMMENT '电磁波反射-成果数据信息主键ID',
  `dcbfs_pk` bigint(0) NULL DEFAULT NULL COMMENT '电磁波反射主键',
  `cxxh` decimal(3, 0) NULL DEFAULT NULL COMMENT '测线序号',
  `qdzbx` decimal(4, 0) NULL DEFAULT NULL COMMENT '起点X坐标',
  `qdzby` decimal(4, 0) NULL DEFAULT NULL COMMENT '起点Y坐标',
  `zdzbx` decimal(4, 0) NULL DEFAULT NULL COMMENT '终点X坐标',
  `zdzby` decimal(4, 0) NULL DEFAULT NULL COMMENT '终点Y坐标',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`dcbfs_resultinfo_pk`) USING BTREE,
  UNIQUE INDEX `uk_dcbfs_resultinfo_id`(`dcbfs_resultinfo_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '电磁波反射-成果数据信息表';

-- ----------------------------
-- Records of t_dcbfs_resultinfo
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_dcbfs_resultpic
-- ----------------------------
DROP TABLE IF EXISTS `t_dcbfs_resultpic`;
CREATE TABLE `t_dcbfs_resultpic`  (
  `dcbfs_resultpic_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '电磁波反射-成果图主键',
  `dcbfs_resultpic_id` bigint(0) NULL DEFAULT NULL COMMENT '电磁波反射-成果图主键ID',
  `dcbfs_pk` bigint(0) NULL DEFAULT NULL COMMENT '电磁波反射主键',
  `cxname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '测线名称',
  `pic1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '波形图',
  `pic2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '波形彩图',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`dcbfs_resultpic_pk`) USING BTREE,
  UNIQUE INDEX `uk_dcbfs_resultpic_id`(`dcbfs_resultpic_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '电磁波反射-成果图表';

-- ----------------------------
-- Records of t_dcbfs_resultpic
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_department
-- ----------------------------
DROP TABLE IF EXISTS `t_department`;
CREATE TABLE `t_department`  (
  `department_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '部门表主键',
  `department_id` bigint(0) NULL DEFAULT NULL COMMENT '部门id:部门唯一标识',
  `department_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '部门名称:中文部门全称',
  `shortname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '部门简称:可为空',
  `parent_id` bigint(0) NULL DEFAULT NULL COMMENT '父部门id:上级部门ID',
  `department_priority` int(0) NULL DEFAULT 0 COMMENT '排序:用于前端排序',
  `useFlag` tinyint(0) NULL DEFAULT 1 COMMENT '使用标志:1在用;0删除',
  PRIMARY KEY (`department_pk`) USING BTREE,
  UNIQUE INDEX `uk_department_id`(`department_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '部门表';

-- ----------------------------
-- Records of t_department
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_dssm
-- ----------------------------
DROP TABLE IF EXISTS `t_dssm`;
CREATE TABLE `t_dssm`  (
  `dssm_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '洞身素描主键',
  `dssm_id` bigint(0) NULL DEFAULT NULL COMMENT '洞身素描ID',
  `yb_pk` bigint(0) NULL DEFAULT NULL COMMENT '预报分段信息主键',
  `beginkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '开始里程值(m)',
  `dssm_length` decimal(10, 2) NULL DEFAULT NULL COMMENT '开挖循环长度(m)',
  `sjwydj` decimal(1, 0) NULL DEFAULT NULL COMMENT '设计围岩等级(1-6)',
  `sgwydj` decimal(1, 0) NULL DEFAULT NULL COMMENT '施工围岩等级(1-6)',
  `sjdzms` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '设计工程地质、水文地质描述',
  `sgdztz` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '地层岩性特征',
  `sggztz` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '构造特征',
  `shswtz` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '水文地质特征',
  `zbqsmt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '左边墙素描图流水号:serialno',
  `zbqxct` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '左边墙现场照片流水号:serialno',
  `gbsmt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '拱部素描图流水号',
  `gbxct` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '拱部现场照片流水号',
  `ybqsmt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '右边墙素描图流水号',
  `ybqxct` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '右边墙现场照片流水号',
  `addition` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '附件流水号序列',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '起点里程值(m)',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `monitordate` datetime(0) NULL DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  PRIMARY KEY (`dssm_pk`) USING BTREE,
  UNIQUE INDEX `uk_dssm_id`(`dssm_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '洞身素描数据表';

-- ----------------------------
-- Records of t_dssm
-- ----------------------------
BEGIN;
INSERT INTO `t_dssm` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 12:17:47', '2025-10-28 12:17:47', NULL, NULL, NULL, NULL), (2, 2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 12:17:52', '2025-10-28 12:17:52', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for t_gfbzld
-- ----------------------------
DROP TABLE IF EXISTS `t_gfbzld`;
CREATE TABLE `t_gfbzld`  (
  `gfbzld_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '高分辨直流电主键',
  `gfbzld_id` bigint(0) NULL DEFAULT NULL COMMENT '高分辨直流电数据ID',
  `wtf_pk` bigint(0) NULL DEFAULT NULL COMMENT '物探法主键',
  `gddjnum` decimal(2, 0) NULL DEFAULT NULL COMMENT '供电电极数量:单位:个,不超过2位整数',
  `cldjnum` decimal(2, 0) NULL DEFAULT NULL COMMENT '测量电极测点数量:单位:个,不超过2位整数',
  `sb_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '设备名称:设备型号或名称',
  `gddy` decimal(3, 0) NULL DEFAULT NULL COMMENT '供电电压:单位:v,不超过3位整数',
  `gddl` decimal(3, 0) NULL DEFAULT NULL COMMENT '供电电流:单位:mA,不超过3位整数',
  `pic1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电势等值线图',
  `pic2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '成果图',
  `pic3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '平剖图',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`gfbzld_pk`) USING BTREE,
  UNIQUE INDEX `uk_gfbzld_id`(`gfbzld_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '高分辨直流电数据表';

-- ----------------------------
-- Records of t_gfbzld
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_gfbzld_resultinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_gfbzld_resultinfo`;
CREATE TABLE `t_gfbzld_resultinfo`  (
  `gfbzld_resultinfo_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '高分辨直流电-成果数据信息主键',
  `gfbzld_resultinfo_id` bigint(0) NULL DEFAULT NULL COMMENT '高分辨直流电-成果数据信息ID',
  `gfbzld_pk` bigint(0) NULL DEFAULT NULL COMMENT '高分辨直流电主键',
  `djxh` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电极序号',
  `gfbzld_resultinfo_type` decimal(1, 0) NULL DEFAULT NULL COMMENT '类型',
  `jzzmjl` decimal(5, 1) NULL DEFAULT NULL COMMENT '距掌子面距离',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`gfbzld_resultinfo_pk`) USING BTREE,
  UNIQUE INDEX `uk_gfbzld_resultinfo_id`(`gfbzld_resultinfo_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '高分辨直流电-成果数据信息表';

-- ----------------------------
-- Records of t_gfbzld_resultinfo
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_gzw
-- ----------------------------
DROP TABLE IF EXISTS `t_gzw`;
CREATE TABLE `t_gzw`  (
  `gzw_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '构筑物主键',
  `gzw_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '构筑物ID:构筑物ID',
  `bd_pk` bigint(0) NULL DEFAULT NULL COMMENT '标段表主键',
  `gzwname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '构筑物名称:构筑物名称',
  `gzw_start_kilo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '开始里程:构筑物的开始里程值',
  `gzw_stop_kilo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '结束里程:构筑物的结束里程值',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`gzw_pk`) USING BTREE,
  UNIQUE INDEX `uk_gzw_id`(`gzw_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '构筑物表';

-- ----------------------------
-- Records of t_gzw
-- ----------------------------
BEGIN;
INSERT INTO `t_gzw` VALUES (1, 'gzw_001', 1, '大庆山隧道', NULL, NULL, '2025-10-24 00:45:45', '2025-10-24 00:45:45'), (2, 'gzw_002', 1, '青龙山隧道', NULL, NULL, '2025-10-24 00:46:07', '2025-10-24 00:52:32'), (3, 'gzw_003', 2, '白岩一号隧道', NULL, NULL, '2025-10-24 18:51:21', '2025-10-24 18:51:27');
COMMIT;

-- ----------------------------
-- Table structure for t_hsp
-- ----------------------------
DROP TABLE IF EXISTS `t_hsp`;
CREATE TABLE `t_hsp`  (
  `hsp_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'HSP主键',
  `hsp_id` bigint(0) NULL DEFAULT NULL COMMENT 'HSP数据ID',
  `wtf_pk` bigint(0) NULL DEFAULT NULL COMMENT '物探法主键',
  `cqnum` decimal(2, 0) NULL DEFAULT NULL COMMENT '测区数量:两位数整数',
  `cdnum` decimal(2, 0) NULL DEFAULT NULL COMMENT '测区测点数量:两位数整数',
  `jsfs` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '接收方式:文字描述',
  `sb_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '设备名称:如:HSP206型',
  `pic1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '波形图',
  `pic2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '成果图',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`hsp_pk`) USING BTREE,
  UNIQUE INDEX `uk_hsp_id`(`hsp_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'HSP数据表';

-- ----------------------------
-- Records of t_hsp
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_ldsn
-- ----------------------------
DROP TABLE IF EXISTS `t_ldsn`;
CREATE TABLE `t_ldsn`  (
  `ldsn_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '陆地声呐主键',
  `ldsn_id` bigint(0) NULL DEFAULT NULL COMMENT '陆地声呐ID',
  `wtf_pk` bigint(0) NULL DEFAULT NULL COMMENT '物探法主键',
  `cxnum` decimal(2, 0) NULL DEFAULT NULL COMMENT '测线条数:测线的总条数',
  `sb_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '设备名称:陆地声呐设备的名称',
  `pic1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '剖面图',
  `pic2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '测线布置图',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`ldsn_pk`) USING BTREE,
  UNIQUE INDEX `uk_ldsn_id`(`ldsn_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '陆地声呐表';

-- ----------------------------
-- Records of t_ldsn
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_ldsn_resultinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_ldsn_resultinfo`;
CREATE TABLE `t_ldsn_resultinfo`  (
  `ldsn_resultinfo_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '陆地声纳-成果数据信息主键',
  `ldsn_resultinfo_id` bigint(0) NULL DEFAULT NULL COMMENT '陆地声纳-成果数据信息ID',
  `ldsn_pk` bigint(0) NULL DEFAULT NULL COMMENT '陆地声呐主键',
  `cdxh` decimal(3, 0) NULL DEFAULT NULL COMMENT '测点序号:序号由1开始递增',
  `jgdjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '距拱顶距离:保留1位小数,整数位不能超过2位(单位:m)',
  `jzxjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '距左线距离:保留1位小数,整数位不能超过2位(单位:m)',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`ldsn_resultinfo_pk`) USING BTREE,
  UNIQUE INDEX `uk_ldsn_resultinfo_id`(`ldsn_resultinfo_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '陆地声纳-成果数据信息表';

-- ----------------------------
-- Records of t_ldsn_resultinfo
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_sbdc
-- ----------------------------
DROP TABLE IF EXISTS `t_sbdc`;
CREATE TABLE `t_sbdc`  (
  `sbdc_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '瞬变电磁主键',
  `sbdc_id` bigint(0) NULL DEFAULT NULL COMMENT '瞬变电磁数据ID',
  `wtf_pk` bigint(0) NULL DEFAULT NULL COMMENT '物探法主键',
  `sbdc_type` decimal(1, 0) NULL DEFAULT NULL COMMENT '采集装置类型:1重叠回线;2中心回线;3偶级装置',
  `fskwzlc` decimal(10, 2) NULL DEFAULT NULL COMMENT '发射框位置里程:单位:m,保留2位小数',
  `fskc` decimal(5, 1) NULL DEFAULT NULL COMMENT '发射框长:单位:m,保留1位小数',
  `fskk` decimal(5, 1) NULL DEFAULT NULL COMMENT '发射框宽:单位:m,保留1位小数',
  `jfxqzs` decimal(3, 0) NULL DEFAULT NULL COMMENT '激发线圈匝数:单位:个,不超过3位整数',
  `jskc` decimal(5, 1) NULL DEFAULT NULL COMMENT '接收框长:单位:m,保留1位小数',
  `jskk` decimal(5, 1) NULL DEFAULT NULL COMMENT '接收框宽:单位:m,保留1位小数',
  `jskzs` decimal(3, 0) NULL DEFAULT NULL COMMENT '接收框匝数:单位:个,不超过3位整数',
  `jsxqdxmj` decimal(5, 1) NULL DEFAULT NULL COMMENT '接收线圈等效面积:单位:m²,保留1位小数',
  `sf` decimal(5, 1) NULL DEFAULT NULL COMMENT '收发距:单位:m,保留1位小数,仅采集装置类型=3时必填',
  `sb_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '设备名称:如:PROTEM-47',
  `fspl` decimal(5, 1) NULL DEFAULT NULL COMMENT '发射频率:单位:Hz,保留1位小数',
  `gddl` decimal(5, 1) NULL DEFAULT NULL COMMENT '供电电流:单位:A,保留1位小数',
  `clsj` decimal(5, 1) NULL DEFAULT NULL COMMENT '测量时间:单位:s,保留1位小数',
  `mqfw` decimal(5, 1) NULL DEFAULT NULL COMMENT '盲区范围:单位:m,保留1位小数',
  `cxbzms` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '测线布置描述:文字描述',
  `pic1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电阻率剖面图:图片格式:jpg,大小≤2M,多张流水号用#分割',
  `pic2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '视电阻率剖面图:图片格式:jpg,大小≤2M,多张流水号用#分割',
  `pic3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作业现场图片:图片格式:jpg,大小≤2M,多张流水号用#分割',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`sbdc_pk`) USING BTREE,
  UNIQUE INDEX `uk_sbdc_id`(`sbdc_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '瞬变电磁数据表';

-- ----------------------------
-- Records of t_sbdc
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_site
-- ----------------------------
DROP TABLE IF EXISTS `t_site`;
CREATE TABLE `t_site`  (
  `site_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '工点主键',
  `site_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '隧道工点ID:隧道工点ID',
  `gzw_pk` bigint(0) NULL DEFAULT NULL COMMENT '构筑物主键',
  `sitename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '隧道工点名称:隧道工点名称',
  `sitecode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '隧道工点编码:隧道工点编码',
  `site_start_kilo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '开始里程:工点的开始里程值',
  `site_stop_kilo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '结束里程:工点的结束里程值',
  `useflag` tinyint(0) NULL DEFAULT NULL COMMENT '工点状态 0:已删除 1:在用',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`site_pk`) USING BTREE,
  UNIQUE INDEX `uk_site_id`(`site_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '工点表';

-- ----------------------------
-- Records of t_site
-- ----------------------------
BEGIN;
INSERT INTO `t_site` VALUES (1, '大庆山_site_001', 1, 'DK713+920大庆山隧道明洞', NULL, NULL, NULL, NULL, '2025-10-24 00:46:49', '2025-10-24 00:46:49'), (2, '大庆山_site_002', 1, 'DK713+920大庆山隧道明洞小里程', NULL, NULL, NULL, NULL, '2025-10-24 00:47:29', '2025-10-24 00:47:29'), (3, '青龙山_site_001', 2, '青龙山隧道出口明洞', NULL, NULL, NULL, NULL, '2025-10-24 00:47:52', '2025-10-24 00:48:03'), (4, '白岩一号隧道出口_site_001', 3, '白岩一号隧道出口', NULL, NULL, NULL, NULL, '2025-10-24 18:52:50', '2025-10-24 18:56:34'), (5, '白岩一号隧道出口_site_002', 3, '白岩一号隧道出口洞门', NULL, NULL, NULL, NULL, '2025-10-24 18:53:01', '2025-10-24 18:57:01'), (6, '白岩一号隧道出口_site_003', 3, '白岩一号隧道进口明洞', NULL, NULL, NULL, NULL, '2025-10-24 18:55:17', '2025-10-24 18:57:07');
COMMIT;

-- ----------------------------
-- Table structure for t_sjdz
-- ----------------------------
DROP TABLE IF EXISTS `t_sjdz`;
CREATE TABLE `t_sjdz`  (
  `sjdz_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '设计地质主键',
  `sjdz_id` bigint(0) NULL DEFAULT NULL COMMENT '设计地质ID',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `method` decimal(1, 0) NULL DEFAULT NULL COMMENT '影响因素:(1:岩溶发育度;2:瓦斯影响度;3:地应力影响度;4:涌水涌泥程度;5:断层稳定程度)',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '起点里程值(m)',
  `sjdz_length` decimal(10, 2) NULL DEFAULT NULL COMMENT '长度(m)',
  `dzxxfj` decimal(1, 0) NULL DEFAULT NULL COMMENT '复杂程度分级(1简单..4复杂)',
  `revise` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改原因(type!=1 必填)',
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '操作人账号',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`sjdz_pk`) USING BTREE,
  UNIQUE INDEX `uk_sjdz_id`(`sjdz_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '设计地质信息表';

-- ----------------------------
-- Records of t_sjdz
-- ----------------------------
BEGIN;
INSERT INTO `t_sjdz` VALUES (1, 1, 1, 1, 'DK', NULL, NULL, 1, NULL, NULL, '2025-10-25 16:11:04', '2025-10-25 16:11:04'), (2, 2, 1, 0, NULL, NULL, NULL, 2, NULL, NULL, '2025-10-25 16:11:21', '2025-10-25 16:11:25'), (3, 3, 1, 3, NULL, NULL, NULL, 1, NULL, NULL, '2025-10-25 16:11:33', '2025-10-25 16:11:33'), (4, 4, 1, 2, NULL, NULL, NULL, 4, NULL, NULL, '2025-10-25 16:11:41', '2025-10-25 16:11:41'), (5, 5, 1, 1, NULL, NULL, NULL, 1, NULL, NULL, '2025-10-25 16:11:48', '2025-10-25 16:11:48'), (6, 6, 1, 1, NULL, NULL, NULL, 2, NULL, NULL, '2025-10-25 16:11:56', '2025-10-25 16:11:56');
COMMIT;

-- ----------------------------
-- Table structure for t_sjwydj
-- ----------------------------
DROP TABLE IF EXISTS `t_sjwydj`;
CREATE TABLE `t_sjwydj`  (
  `sjwydj_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '设计围岩等级主键',
  `sjwydj_id` bigint(0) NULL DEFAULT NULL COMMENT '设计围岩等级ID',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '起点里程值(m)',
  `sjwydj_length` decimal(10, 2) NULL DEFAULT NULL COMMENT '长度(m)',
  `wydj` decimal(1, 0) NULL DEFAULT NULL COMMENT '围岩等级(1-6)',
  `revise` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改说明',
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '操作人账号',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`sjwydj_pk`) USING BTREE,
  UNIQUE INDEX `uk_sjwydj_id`(`sjwydj_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '设计围岩等级表';

-- ----------------------------
-- Records of t_sjwydj
-- ----------------------------
BEGIN;
INSERT INTO `t_sjwydj` VALUES (1, 1, 1, 'DK', 76475.00, 10.00, 1, NULL, NULL, '2025-10-25 15:49:10', '2025-10-25 15:50:12'), (2, 2, 1, 'DK', 76475.00, 20.00, 1, NULL, NULL, '2025-10-25 15:49:17', '2025-10-25 15:50:13'), (3, 3, 1, 'DK', 76475.00, 30.00, 2, NULL, NULL, '2025-10-25 15:49:24', '2025-10-25 15:50:15'), (4, 4, 1, 'DK', 76475.00, 40.00, 3, NULL, NULL, '2025-10-25 15:49:33', '2025-10-25 15:50:15'), (5, 5, 1, 'DK', 76475.00, 50.00, 2, NULL, NULL, '2025-10-25 15:49:39', '2025-10-25 15:50:16'), (6, 6, 1, 'DK', 76475.00, 60.00, 1, NULL, NULL, '2025-10-25 15:49:50', '2025-10-25 15:50:17');
COMMIT;

-- ----------------------------
-- Table structure for t_sjyb
-- ----------------------------
DROP TABLE IF EXISTS `t_sjyb`;
CREATE TABLE `t_sjyb`  (
  `sjyb_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '设计预报主键',
  `sjyb_id` bigint(0) NULL DEFAULT NULL COMMENT '设计预报ID',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `method` decimal(2, 0) NULL COMMENT '预报方法:(0:其他;1:地震波反射;2:水平声波剖面;3:陆地声呐;4:电磁波反射;5:高分辨直流电;6:瞬变电磁;7:掌子面素描;8:洞身素描;12:地表补充地质调查;13:超前水平钻;14:加深炮孔;99:全部;)',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '起点里程值(m)',
  `sjyb_length` decimal(10, 2) NULL DEFAULT NULL COMMENT '长度(m)',
  `zxms` decimal(6, 2) NULL DEFAULT NULL COMMENT '最小埋深(m)',
  `zksl` int(0) NULL DEFAULT NULL COMMENT '钻孔数量:(当method=13或14时必填)',
  `qxsl` int(0) NULL DEFAULT NULL COMMENT '取芯数量:(当method=13时必填)',
  `revise` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改原因说明:(type!=1 时必填)',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '填写人账号',
  `plantime` datetime(0) NULL DEFAULT NULL COMMENT '填写时间:(终端平台入库时间)',
  `plannum` int(0) NULL DEFAULT NULL COMMENT '设计预报次数',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`sjyb_pk`) USING BTREE,
  UNIQUE INDEX `uk_sjyb_id`(`sjyb_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '设计预报方法表';

-- ----------------------------
-- Records of t_sjyb
-- ----------------------------
BEGIN;
INSERT INTO `t_sjyb` VALUES (1, 1, 1, 1, 'DK', 76475.00, 10.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 14:52:31', '2025-10-25 14:59:05'), (2, 2, 1, 0, 'DK', 76475.00, 20.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 14:52:40', '2025-10-25 14:59:06'), (3, 3, 1, 0, 'DK', 76475.00, 30.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 14:52:50', '2025-10-25 14:59:08'), (4, 4, 1, 1, 'DK', 76475.00, 40.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 14:52:57', '2025-10-25 14:59:25'), (5, 5, 1, 0, 'DK', 76475.00, 50.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 14:53:03', '2025-10-25 14:59:09'), (6, 6, 1, 1, 'DK', 76475.00, 60.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 14:53:13', '2025-10-25 14:59:27');
COMMIT;

-- ----------------------------
-- Table structure for t_tsp
-- ----------------------------
DROP TABLE IF EXISTS `t_tsp`;
CREATE TABLE `t_tsp`  (
  `tsp_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'TSP主键',
  `tsp_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'TSP数据ID',
  `wtf_pk` bigint(0) NULL DEFAULT NULL COMMENT '物探法主键',
  `jfpknum` decimal(2, 0) NULL DEFAULT NULL COMMENT '激发孔个数:两位整数',
  `jfpksd` decimal(3, 1) NULL DEFAULT NULL COMMENT '激发孔平均深度:保留1位小数,整数位≤2位(单位:m)',
  `jfpkzj` decimal(3, 1) NULL DEFAULT NULL COMMENT '激发孔平均直径:保留1位小数,整数位≤2位(单位:mm)',
  `jfpkjdmgd` decimal(3, 1) NULL DEFAULT NULL COMMENT '激发孔距底面平均高度:保留1位小数,整数位≤2位(单位:m)',
  `jfpkjj` decimal(3, 1) NULL DEFAULT NULL COMMENT '激发孔间距:保留1位小数,整数位≤2位(单位:m)',
  `jspknum` decimal(2, 0) NULL DEFAULT NULL COMMENT '接收孔个数:整数',
  `jspksd` decimal(3, 1) NULL DEFAULT NULL COMMENT '接收孔平均深度:保留1位小数,整数位≤2位(单位:m)',
  `jspkzj` decimal(3, 1) NULL DEFAULT NULL COMMENT '接收孔平均直径:保留1位小数,整数位≤2位(单位:mm)',
  `jspkjdmgd` decimal(3, 1) NULL DEFAULT NULL COMMENT '接收孔距底面平均高度:保留1位小数,整数位≤2位(单位:m)',
  `sb_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '设备名称 如:TSP 203plus',
  `kwwz` decimal(1, 0) NULL DEFAULT NULL COMMENT '炮孔布置 1:面向掌子面左边墙 2:面向掌子面右边墙',
  `leftkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '左里程:保留2位小数(单位:m,如DK215+763.32记为215763.32)',
  `rightkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '右里程:保留2位小数(单位:m,如DK215+763.32记为215763.32)',
  `leftjgdczjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '左距拱顶垂直距离:保留1位小数,整数位≤2位(单位:m)',
  `rightjgdczjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '右距拱顶垂直距离:保留1位小数,整数位≤2位(单位:m)',
  `leftzxjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '左距中线距离:整数位≤2位(单位:m)',
  `rightzxjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '右距中线距离:保留1位小数,整数位≤2位(单位:m)',
  `leftjdmgd` decimal(3, 1) NULL DEFAULT NULL COMMENT '左距地面高度:保留1位小数,整数位≤2位(单位:m)',
  `rightjdmgd` decimal(3, 1) NULL DEFAULT NULL COMMENT '右距地面高度:保留1位小数,整数位≤2位(单位:m)',
  `leftks` decimal(3, 1) NULL DEFAULT NULL COMMENT '左孔深:保留1位小数,整数位≤2位(单位:m)',
  `rightks` decimal(3, 1) NULL DEFAULT NULL COMMENT '右孔深:保留1位小数,整数位≤2位(单位:m)',
  `leftqj` decimal(4, 1) NULL DEFAULT NULL COMMENT '左倾角:保留1位小数,整数位≤3位(单位:°,向上为正、向下为负)',
  `rightqj` decimal(4, 1) NULL DEFAULT NULL COMMENT '右倾角:保留1位小数,整数位≤3位(单位:°,向上为正、向下为负)',
  `pic1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '波速分布图',
  `pic2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '岩土物性图',
  `pic3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'X云图',
  `pic4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'Y云图',
  `pic5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'Z云图',
  `pic6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '2D成果图',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间 记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间 记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`tsp_pk`) USING BTREE,
  UNIQUE INDEX `uk_tsp_id`(`tsp_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'TSP观测系统及设备信息孔位信息表';

-- ----------------------------
-- Records of t_tsp
-- ----------------------------
BEGIN;
INSERT INTO `t_tsp` VALUES (1, 'tsp_001', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 22:35:44', '2025-10-25 22:35:44');
COMMIT;

-- ----------------------------
-- Table structure for t_tsp_bxdata
-- ----------------------------
DROP TABLE IF EXISTS `t_tsp_bxdata`;
CREATE TABLE `t_tsp_bxdata`  (
  `tsp_bxdata_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '围岩参数主键',
  `tsp_bxdata_id` bigint(0) NULL DEFAULT NULL COMMENT '围岩参数ID',
  `tsp_pk` bigint(0) NULL DEFAULT NULL COMMENT 'TSP主键',
  `jbq` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '检波器 检波器名称或编号',
  `jbxh` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '检波器序号 检波器序号',
  `bx` decimal(1, 0) NULL DEFAULT NULL COMMENT '波型 1:P波; 2:SV波; 3:SH波',
  `sdlcz` decimal(10, 2) NULL DEFAULT NULL COMMENT '断面里程值 检波器所在断面里程值,单位:m,保留2位小数',
  `bs` decimal(8, 2) NULL DEFAULT NULL COMMENT '速度 单位:m/s',
  `vps` decimal(8, 2) NULL DEFAULT NULL COMMENT 'VP/VS 保留2位小数',
  `bsb` decimal(8, 2) NULL DEFAULT NULL COMMENT '泊松比 保留2位小数',
  `md` decimal(8, 2) NULL DEFAULT NULL COMMENT '密度 单位:g/cm³,保留2位小数',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间 记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间 记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`tsp_bxdata_pk`) USING BTREE,
  UNIQUE INDEX `uk_tsp_bxdata_id`(`tsp_bxdata_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'TSP围岩岩体物理学参数表';

-- ----------------------------
-- Records of t_tsp_bxdata
-- ----------------------------
BEGIN;
INSERT INTO `t_tsp_bxdata` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 22:33:16', '2025-10-25 22:33:16'), (2, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 22:33:22', '2025-10-25 22:33:22'), (3, 3, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 22:33:27', '2025-10-25 22:33:27');
COMMIT;

-- ----------------------------
-- Table structure for t_tsp_pddata
-- ----------------------------
DROP TABLE IF EXISTS `t_tsp_pddata`;
CREATE TABLE `t_tsp_pddata`  (
  `tsp_pddata_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '炮点参数主键',
  `tsp_pddata_id` bigint(0) NULL DEFAULT NULL COMMENT '炮点参数ID',
  `tsp_pk` bigint(0) NULL DEFAULT NULL COMMENT 'TSP主键',
  `pdjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '距离:单位:m,保留1位小数,炮点到接收器的距离,整数位≤2位',
  `pdsd` decimal(3, 1) NULL DEFAULT NULL COMMENT '深度:单位:m,保留1位小数,整数位≤2位',
  `height` decimal(3, 1) NULL DEFAULT NULL COMMENT '高度:单位:m,保留1位小数,整数位≤2位',
  `qj` decimal(4, 1) NULL DEFAULT NULL COMMENT '倾角:沿轴径向,向下为正,向上为负,保留1位小数,整数位≤3位',
  `fwj` decimal(4, 1) NULL DEFAULT NULL COMMENT '方位角:孔洞方向的方位角,保留1位小数,整数位≤3位',
  `yl` decimal(6, 1) NULL DEFAULT NULL COMMENT '药量:单位:g,不可超过5位数',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`tsp_pddata_pk`) USING BTREE,
  UNIQUE INDEX `uk_tsp_pddata_id`(`tsp_pddata_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'TSP炮点参数表';

-- ----------------------------
-- Records of t_tsp_pddata
-- ----------------------------
BEGIN;
INSERT INTO `t_tsp_pddata` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 22:33:33', '2025-10-25 22:33:33'), (2, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 22:33:41', '2025-10-25 22:33:41'), (3, 3, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 22:33:46', '2025-10-25 22:33:46'), (4, 4, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 22:33:50', '2025-10-25 22:33:50');
COMMIT;

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `user_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '用户表主键',
  `user_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户ID',
  `account` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '账号:登录平台账号',
  `realname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '姓名:真实姓名',
  `department_id` bigint(0) NULL DEFAULT NULL COMMENT '部门id',
  `useflag` tinyint(0) NULL DEFAULT 1 COMMENT '删除标识:1在用;0删除',
  `telephone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电话:手机号或座机',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`user_pk`) USING BTREE,
  UNIQUE INDEX `uk_user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表';

-- ----------------------------
-- Records of t_user
-- ----------------------------
BEGIN;
INSERT INTO `t_user` VALUES (1, '001', 'account_001', 'StephenChan', NULL, 1, NULL, '2025-10-24 00:42:51', '2025-10-24 00:42:51');
COMMIT;

-- ----------------------------
-- Table structure for t_user_bd
-- ----------------------------
DROP TABLE IF EXISTS `t_user_bd`;
CREATE TABLE `t_user_bd`  (
  `user_pk` bigint(0) NOT NULL COMMENT '用户主键',
  `bd_pk` bigint(0) NOT NULL COMMENT '标段主键',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户-标段关联表';

-- ----------------------------
-- Records of t_user_bd
-- ----------------------------
BEGIN;
INSERT INTO `t_user_bd` VALUES (1, 1, '2025-10-24 00:50:15', '2025-10-24 00:50:15'), (1, 2, '2025-10-24 18:54:14', '2025-10-24 18:54:14');
COMMIT;

-- ----------------------------
-- Table structure for t_wtf
-- ----------------------------
DROP TABLE IF EXISTS `t_wtf`;
CREATE TABLE `t_wtf`  (
  `wtf_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '物探法主键',
  `wtf_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '物探法数据记录ID',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `yb_pk` bigint(0) NULL DEFAULT NULL COMMENT '预报分段信息主键',
  `method` decimal(1, 0) NULL DEFAULT NULL COMMENT '预报方法:(1:TSP;2:HSP;3:陆地声纳;4:电磁波反射;5:高分辨直流电;6:瞬变电磁;9:微震监测预报;0:其他)',
  `originalfile` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '原始文件流水号序列',
  `addition` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '附件(其他报告)流水号序列',
  `images` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作业现场图流水号序列',
  `gcxtpic` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '观测系统布置图流水号',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '掌子面里程',
  `monitordate` datetime(0) NULL DEFAULT NULL COMMENT '预报时间:格式:YYYY-MM-DD HH24:MI:SS',
  `wtf_length` decimal(10, 2) NULL DEFAULT NULL COMMENT '预报长度(m)',
  PRIMARY KEY (`wtf_pk`) USING BTREE,
  UNIQUE INDEX `uk_wtf_id`(`wtf_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '物探法基本表';

-- ----------------------------
-- Records of t_wtf
-- ----------------------------
BEGIN;
INSERT INTO `t_wtf` VALUES (1, 'wtf_001', 1, 1, 1, NULL, NULL, NULL, NULL, '2025-10-25 22:32:31', '2025-10-25 23:33:03', NULL, NULL, NULL, NULL), (2, 'wtf_002', 1, 2, 2, NULL, NULL, NULL, NULL, '2025-10-28 00:08:48', '2025-10-28 00:08:48', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for t_wzjc
-- ----------------------------
DROP TABLE IF EXISTS `t_wzjc`;
CREATE TABLE `t_wzjc`  (
  `wzjc_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '微震监测主键',
  `wzjc_id` bigint(0) NULL DEFAULT NULL COMMENT '微震监测数据ID',
  `wtf_pk` bigint(0) NULL DEFAULT NULL COMMENT '物探法主键',
  `cum_eventnum` decimal(8, 0) NULL DEFAULT NULL COMMENT '累积微震事件数:单位 个,不超过8位整数',
  `cum_energy` decimal(10, 2) NULL DEFAULT NULL COMMENT '累积微震释放能:单位 lgE/J,保留2位小数',
  `cum_appvol` decimal(10, 2) NULL DEFAULT NULL COMMENT '累积微震视体积:单位 lgV/m³,保留2位小数',
  `event_rate` decimal(10, 2) NULL DEFAULT NULL COMMENT '微震事件率:单位 个/天,保留2位小数',
  `energy_rate` decimal(10, 2) NULL DEFAULT NULL COMMENT '微震释放能率:单位 lgE/J/天,保留2位小数',
  `appvol_rate` decimal(10, 2) NULL DEFAULT NULL COMMENT '微震视体积率:单位 lgV/m³/天,保留2位小数',
  `hdtzfxyms` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '活动特征分析与描述:文字描述',
  `wzsjfbtzt` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '预警区域内微震事件分布特征图流水号:图片格式jpg/png,大小≤10M,多张流水号用#分割',
  `ljwzsjst` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '累积微震事件数图流水号:图片格式jpg/png,大小≤10M,多张流水号用#分割',
  `ljwzsflt` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '累积微震释放能图流水号:图片格式jpg/png,大小≤10M,多张流水号用#分割',
  `ljwzstjt` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '累积微震视体积图流水号:图片格式jpg/png,大小≤10M,多张流水号用#分割',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`wzjc_pk`) USING BTREE,
  UNIQUE INDEX `uk_wzjc_id`(`wzjc_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '微震监测预报原始数据表';

-- ----------------------------
-- Records of t_wzjc
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_yb
-- ----------------------------
DROP TABLE IF EXISTS `t_yb`;
CREATE TABLE `t_yb`  (
  `yb_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '预报分段信息主键',
  `yb_id` bigint(0) NULL DEFAULT NULL COMMENT '预报分段信息ID',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号:如,正线:DK;左线ZDK;右线:YDK;比较线DIK等',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '掌子面里程值',
  `yb_length` decimal(8, 2) NULL DEFAULT NULL COMMENT '预报长度',
  `monitordate` datetime(0) NULL DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  `createdate` datetime(0) NULL DEFAULT NULL COMMENT '上传日期:格式:YYYY-MM-DD HH24:MI:SS',
  `testname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '检测人姓名:检测人姓名',
  `testno` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '检测人身份证:检测人身份证号码',
  `testtel` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '检测人电话:检测人联系电话',
  `monitorname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '复核人姓名:复核人姓名',
  `monitorno` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '复核人身份证:复核人身份证号码',
  `monitortel` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '复核人电话:复核人联系电话',
  `supervisorname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '现场监理人员:监理人员姓名',
  `supervisorno` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '监理人员身份证:监理人员身份证号码',
  `supervisortel` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '监理人员电话:监理人员联系电话',
  `conclusionyb` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '预报结论:文字描述',
  `suggestion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '后续建议:文字描述',
  `solution` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '实际采取措施:文字描述',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '备注:文字描述',
  `method` decimal(1, 0) NULL DEFAULT NULL COMMENT '预报方法:1=TSP;2=HSP;3=陆地声纳;4=电磁波反射;5=高分辨直流电;7=掌子面素描;8=洞身素描;12=地表信息;13=超前水平钻;14=加深炮孔',
  `flag` tinyint(1) NULL DEFAULT NULL COMMENT '使用标识:(0=在用;1=删除)',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '记录创建时间:数据库自动维护',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '记录更新时间:数据库自动维护',
  PRIMARY KEY (`yb_pk`) USING BTREE,
  UNIQUE INDEX `uk_yb_id`(`yb_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '预报分段信息表';

-- ----------------------------
-- Records of t_yb
-- ----------------------------
BEGIN;
INSERT INTO `t_yb` VALUES (1, 1, 1, 'dk', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 23:09:35', '2025-10-25 23:09:35');
COMMIT;

-- ----------------------------
-- Table structure for t_ybjg
-- ----------------------------
DROP TABLE IF EXISTS `t_ybjg`;
CREATE TABLE `t_ybjg`  (
  `ybjg_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '预报结果主键',
  `ybjg_id` bigint(0) NULL DEFAULT NULL COMMENT '预报结果ID',
  `yb_pk` bigint(0) NULL DEFAULT NULL COMMENT '预报分段信息主键',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `sdkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '开始里程值',
  `edkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '结束里程值',
  `ybjg_time` datetime(0) NULL DEFAULT NULL COMMENT '产生时间:精确至秒,格式YYYY-MM-DD HH:MM:SS',
  `risklevel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '风险类别:(1=破碎带;2=岩溶;3=瓦斯;4=涌水;5=突泥;6=地应力;7=采空区;8=岩爆;0=其他(绿色无风险,其他颜色为其他风险);多个用#分隔,如1#2#3)',
  `grade` decimal(1, 0) NULL DEFAULT NULL COMMENT '地质级别:(1=红色;2=黄色;0=绿色;多个用#分隔,如1#2#0,个数与风险类别对应)',
  `wylevel` decimal(1, 0) NULL DEFAULT NULL COMMENT '围岩等级:(1=Ⅰ级,2=Ⅱ级,3=Ⅲ级,4=Ⅳ级,5=Ⅴ级,6=Ⅵ级)',
  `jlresult` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '探测结论:文字描述',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改时间',
  PRIMARY KEY (`ybjg_pk`) USING BTREE,
  UNIQUE INDEX `uk_ybjg_id`(`ybjg_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '预报结果分段信息表';

-- ----------------------------
-- Records of t_ybjg
-- ----------------------------
BEGIN;
INSERT INTO `t_ybjg` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 23:09:53', '2025-10-25 23:09:53'), (2, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 23:09:59', '2025-10-25 23:09:59');
COMMIT;

-- ----------------------------
-- Table structure for t_zhjl
-- ----------------------------
DROP TABLE IF EXISTS `t_zhjl`;
CREATE TABLE `t_zhjl`  (
  `zhjl_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '综合结论主键',
  `zhjl_id` bigint(0) NULL DEFAULT NULL COMMENT '综合结论ID',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '综合结论简述',
  `addition` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '附件(综合结论报告)流水号序列',
  `warndealflag` tinyint(0) NULL DEFAULT 0 COMMENT '处置状态:(0:未处置;1:已处置)',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`zhjl_pk`) USING BTREE,
  UNIQUE INDEX `uk_zhjl_id`(`zhjl_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '综合结论表';

-- ----------------------------
-- Records of t_zhjl
-- ----------------------------
BEGIN;
INSERT INTO `t_zhjl` VALUES (1, 1, NULL, NULL, 0, '2025-10-29 12:10:54', '2025-10-29 12:10:54'), (2, 2, NULL, NULL, 0, '2025-10-29 12:10:58', '2025-10-29 12:10:58'), (3, 3, NULL, NULL, 0, '2025-10-29 12:11:00', '2025-10-29 12:11:00'), (4, 4, NULL, NULL, 0, '2025-10-29 12:11:02', '2025-10-29 12:11:02');
COMMIT;

-- ----------------------------
-- Table structure for t_zhjl_yb
-- ----------------------------
DROP TABLE IF EXISTS `t_zhjl_yb`;
CREATE TABLE `t_zhjl_yb`  (
  `zhjl_pk` bigint(0) NULL DEFAULT NULL COMMENT '综合结论主键',
  `yb_pk` bigint(0) NULL DEFAULT NULL COMMENT '预报分段信息主键'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '综合结论-预报段表';

-- ----------------------------
-- Records of t_zhjl_yb
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for t_ztf
-- ----------------------------
DROP TABLE IF EXISTS `t_ztf`;
CREATE TABLE `t_ztf`  (
  `ztf_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '钻探法主键',
  `ztf_id` bigint(0) NULL DEFAULT NULL COMMENT '钻探法记录ID',
  `yb_pk` bigint(0) NULL DEFAULT NULL COMMENT '预报分段信息主键',
  `kwtype` decimal(1, 0) NULL DEFAULT NULL COMMENT '钻孔类型:1超前水平钻;2加深炮孔',
  `images` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作业现场图',
  `addition` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '附件流水号',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '起点里程值(m)',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `monitordate` datetime(0) NULL DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  `ztf_length` decimal(10, 2) NULL DEFAULT NULL COMMENT '预报长度',
  PRIMARY KEY (`ztf_pk`) USING BTREE,
  UNIQUE INDEX `uk_ztf_id`(`ztf_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '钻探法';

-- ----------------------------
-- Records of t_ztf
-- ----------------------------
BEGIN;
INSERT INTO `t_ztf` VALUES (1, 1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL), (2, 2, 2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for t_ztf_dcxx
-- ----------------------------
DROP TABLE IF EXISTS `t_ztf_dcxx`;
CREATE TABLE `t_ztf_dcxx`  (
  `ztf_dcxx_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '地层信息主键',
  `ztf_dcxx_id` bigint(0) NULL DEFAULT NULL COMMENT '地层信息ID',
  `dcdh` decimal(3, 0) NULL DEFAULT NULL COMMENT '地层代号',
  `dclc` decimal(10, 2) NULL DEFAULT NULL COMMENT '层底里程:单位m,保留2位小数(如DK215+763.32传215763.32)',
  `fchd` decimal(4, 2) NULL DEFAULT NULL COMMENT '分层厚度:单位m,保留2位小数,整数位≤2位',
  `cslcz` decimal(10, 2) NULL DEFAULT NULL COMMENT '出水位置:单位m,保留2位小数,无出水传0',
  `csl` decimal(7, 2) NULL DEFAULT NULL COMMENT '出水量:单位m³/h,保留2位小数,整数位≤5位',
  `cywz` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '采样位置:选填,采样点描述',
  `gcdzjj` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '工程地质简述:灰岩;泥土;其他(字典不全需沟通)',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  `ztf_zkzz_pk` bigint(0) NULL DEFAULT NULL COMMENT '钻孔柱状图主键',
  PRIMARY KEY (`ztf_dcxx_pk`) USING BTREE,
  UNIQUE INDEX `uk_ztf_dcxx_id`(`ztf_dcxx_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '地层信息表';

-- ----------------------------
-- Records of t_ztf_dcxx
-- ----------------------------
BEGIN;
INSERT INTO `t_ztf_dcxx` VALUES (1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 16:14:06', '2025-10-28 16:14:06', 1), (2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 16:14:11', '2025-10-28 16:14:11', 1);
COMMIT;

-- ----------------------------
-- Table structure for t_ztf_jspk
-- ----------------------------
DROP TABLE IF EXISTS `t_ztf_jspk`;
CREATE TABLE `t_ztf_jspk`  (
  `ztf_jspk_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '加深炮孔主键',
  `ztf_jspk_id` bigint(0) NULL DEFAULT NULL COMMENT '加深炮孔ID',
  `zkwz` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钻孔位置:钻孔所在位置信息',
  `wcj` decimal(4, 1) NULL DEFAULT NULL COMMENT '外插角:单位℃,保留1位小数,整数位不得超过3位',
  `zkcd` decimal(4, 2) NULL DEFAULT NULL COMMENT '钻孔长度:单位m,保留2位小数,整数位不得超过2位',
  `dzqkjs` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钻进特征及地质情况简述:文字描述钻进特征和地质情况',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  `ztf_pk` bigint(0) NULL DEFAULT NULL COMMENT '钻探法主键',
  PRIMARY KEY (`ztf_jspk_pk`) USING BTREE,
  UNIQUE INDEX `uk_ztf_jspk_id`(`ztf_jspk_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '加深炮孔表';

-- ----------------------------
-- Records of t_ztf_jspk
-- ----------------------------
BEGIN;
INSERT INTO `t_ztf_jspk` VALUES (1, 1, NULL, NULL, NULL, NULL, '2025-10-28 16:36:01', '2025-10-28 16:36:01', 1), (2, 2, NULL, NULL, NULL, NULL, '2025-10-28 16:36:05', '2025-10-28 16:36:05', 1), (3, 3, NULL, NULL, NULL, NULL, '2025-10-28 16:36:09', '2025-10-28 16:36:09', 1);
COMMIT;

-- ----------------------------
-- Table structure for t_ztf_zkzz
-- ----------------------------
DROP TABLE IF EXISTS `t_ztf_zkzz`;
CREATE TABLE `t_ztf_zkzz`  (
  `ztf_zkzz_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '钻孔柱状图主键',
  `ztf_zkzz_id` bigint(0) NULL DEFAULT NULL COMMENT '钻孔柱状图ID',
  `ztf_pk` bigint(0) NULL DEFAULT NULL COMMENT '钻探法主键',
  `kwbh` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '孔位编号:序号由1开始递增,不超过10位',
  `jgdjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '距拱顶距离:单位m,保留1位小数,整数位≤2位',
  `jzxxjl` decimal(3, 1) NULL DEFAULT NULL COMMENT '距中心线距离:单位m,保留1位小数,整数位≤2位',
  `kwljangle` decimal(4, 1) NULL DEFAULT NULL COMMENT '开孔立角角度:单位°,保留1位小数,整数位≤3位',
  `kwpjangle` decimal(4, 1) NULL DEFAULT NULL COMMENT '开孔偏角角度:单位°,保留1位小数,整数位≤3位',
  `zkzj` decimal(5, 0) NULL DEFAULT NULL COMMENT '钻孔直径:单位mm,不超过4位整数',
  `zjcode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钻机型号:使用钻机的型号,不超过30位',
  `kssj` datetime(0) NULL DEFAULT NULL COMMENT '开始时间:格式YYYY-MM-DD HH24:MI:SS',
  `jssj` datetime(0) NULL DEFAULT NULL COMMENT '结束时间:格式YYYY-MM-DD HH24:MI:SS',
  `kkwzsyt` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '孔口位置示意图:上传产生的流水号,不超过50位',
  `sfqx` decimal(1, 0) NULL DEFAULT NULL COMMENT '是否取芯:1取芯;0不取芯',
  `qxpic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '取芯照片',
  `remark` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注:选填,文字描述',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (`ztf_zkzz_pk`) USING BTREE,
  UNIQUE INDEX `uk_ztf_zkzz_id`(`ztf_zkzz_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '超前水平钻孔位信息-基本信息';

-- ----------------------------
-- Records of t_ztf_zkzz
-- ----------------------------
BEGIN;
INSERT INTO `t_ztf_zkzz` VALUES (1, 1, 1, '1', 1.0, 2.0, 3.0, 4.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 16:12:09', '2025-10-28 20:00:28');
COMMIT;

-- ----------------------------
-- Table structure for t_ztf_ztjlb
-- ----------------------------
DROP TABLE IF EXISTS `t_ztf_ztjlb`;
CREATE TABLE `t_ztf_ztjlb`  (
  `ztf_ztjlb_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '钻探记录主键',
  `ztf_ztjlb_id` bigint(0) NULL DEFAULT NULL COMMENT '钻探记录ID',
  `kssj` datetime(0) NULL DEFAULT NULL COMMENT '开始时间:格式YYYY-MM-DD HH24:MI:SS',
  `jssj` datetime(0) NULL DEFAULT NULL COMMENT '结束时间:格式YYYY-MM-DD HH24:MI:SS',
  `zksd` decimal(4, 2) NULL DEFAULT NULL COMMENT '钻孔深度:单位m,保留2位小数,整数位≤2位',
  `zkpressure` decimal(7, 2) NULL DEFAULT NULL COMMENT '钻孔压力:单位mPa,保留2位小数,整数位≤5位',
  `zkspeed` decimal(7, 2) NULL DEFAULT NULL COMMENT '钻速:范围值,单位转/分,保留2位小数,以-分割(如55.5-55.8)',
  `kwwaterpre` decimal(7, 2) NULL DEFAULT NULL COMMENT '孔内水压:单位mPa,保留2位小数,整数位≤5位',
  `kwwaterspe` decimal(7, 2) NULL DEFAULT NULL COMMENT '孔内水量:单位m³/h,保留2位小数,整数位≤5位',
  `dzms` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钻进特征及地质情况简述:文字描述',
  `kwzbxl` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '孔位坐标序列:像素坐标,格式X#Y,不超过20位',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  `ztf_zkzz_pk` bigint(0) NULL DEFAULT NULL COMMENT '钻孔柱状图主键',
  PRIMARY KEY (`ztf_ztjlb_pk`) USING BTREE,
  UNIQUE INDEX `uk_ztf_ztjlb_id`(`ztf_ztjlb_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '钻探记录表';

-- ----------------------------
-- Records of t_ztf_ztjlb
-- ----------------------------
BEGIN;
INSERT INTO `t_ztf_ztjlb` VALUES (1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 16:13:34', '2025-10-28 16:13:40', 1), (2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 16:13:52', '2025-10-28 16:13:52', 1), (3, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 16:13:58', '2025-10-28 16:13:58', 1);
COMMIT;

-- ----------------------------
-- Table structure for t_zzmsm
-- ----------------------------
DROP TABLE IF EXISTS `t_zzmsm`;
CREATE TABLE `t_zzmsm`  (
  `zzmsm_pk` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '掌子面素描主键',
  `zzmsm_id` bigint(0) NULL DEFAULT NULL COMMENT '掌子面素描ID',
  `yb_pk` bigint(0) NULL DEFAULT NULL COMMENT '预报分段信息主键',
  `jdkjl` decimal(8, 2) NULL DEFAULT NULL COMMENT '距洞口距离(m)',
  `kwkd` decimal(5, 2) NULL DEFAULT NULL COMMENT '开挖宽度(m)',
  `kwgd` decimal(5, 2) NULL DEFAULT NULL COMMENT '开挖高度(m)',
  `kwmj` decimal(8, 2) NULL DEFAULT NULL COMMENT '开挖面积(m2)',
  `kwfs` decimal(1, 0) NULL DEFAULT NULL COMMENT '开挖方式编号',
  `kwfs2` varchar(126) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '开挖方式补充',
  `bwnum` decimal(3, 0) NULL DEFAULT NULL COMMENT '素描部位编号(参照图1-4-4)',
  `zzmzt` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '掌子面状态:文字描述',
  `zzmsm_type` decimal(1, 0) NULL DEFAULT NULL COMMENT '岩土特征类别:(1岩体;2土体)',
  `ytlx` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '岩体类型(名称):岩体名称',
  `njl` decimal(3, 1) NULL DEFAULT NULL COMMENT '黏聚力:单位MPa,可为空',
  `nfcj` decimal(3, 1) NULL DEFAULT NULL COMMENT '内摩擦角:单位°,可为空',
  `dzbhkyqd` decimal(3, 1) NULL DEFAULT NULL COMMENT '单轴饱和抗压强度:单位MPa,可为空',
  `dhzqdjx` decimal(5, 1) NULL DEFAULT NULL COMMENT '点荷载强度极限:单位MPa,可为空',
  `bxml` decimal(3, 1) NULL DEFAULT NULL COMMENT '变形模量:单位GPa,可为空',
  `bsb` decimal(5, 2) NULL DEFAULT NULL COMMENT '泊松比:可为空',
  `trzd` decimal(3, 1) NULL DEFAULT NULL COMMENT '天然重度:单位kN/m³,可为空',
  `yxzbqt` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '岩性指标其他:文字描述,岩性指标补充说明,可为空',
  `yxzbpd` decimal(1, 0) NULL DEFAULT NULL COMMENT '岩性指标评定:1=极硬岩;2=硬岩;3=较软岩;4=软岩;5=极软岩',
  `dzgzyxcd` decimal(1, 0) NULL DEFAULT NULL COMMENT '地质构造影响程度:1=轻微;2=较重;3=严重;4=极严重',
  `jgmzs` decimal(1, 0) NULL DEFAULT NULL COMMENT '结构面组数:无单位,整数',
  `pjjj` decimal(3, 1) NULL DEFAULT NULL COMMENT '平均间距:单位m,保留1位小数',
  `zyjgmcz` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主要结构面产状:格式XX°∠XX°,允许多个用#分隔(如1#2λ1#2λ1#2)',
  `qtjgmcz` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '其他结构面产状:格式XX°∠XX°,允许多个用#分隔,可为空',
  `ysx` decimal(1, 0) NULL DEFAULT NULL COMMENT '延伸性:1=极差;2=差;3=中等;4=好;5=极好',
  `ccd` decimal(1, 0) NULL DEFAULT NULL COMMENT '粗糙度:1=明显台阶状;2=粗糙波纹状;3=平正光滑有擦痕;4=平整光滑',
  `zkd` decimal(5, 2) NULL DEFAULT NULL COMMENT '张开度:单位mm,保留2位小数',
  `tchjz` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '填充和胶结:文字描述,可为空',
  `fxcd` decimal(1, 0) NULL DEFAULT NULL COMMENT '风化程度:1=未风化;2=微风化;3=弱风化;4=强风化;5=全风化',
  `ytwzsm` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '岩体完整说明:岩体完整状态简要说明,可为空',
  `ytwzztpd` decimal(1, 0) NULL DEFAULT NULL COMMENT '岩体完整状态评定:1=完整;2=较完整;3=较破碎;4=破碎;5=极破碎',
  `soilname` decimal(1, 0) NULL DEFAULT NULL COMMENT '土名称:1=粘性土;2=粉土;3=砂土;4=粗粒土;5=其他',
  `soilname2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '土名称补充:当soilname=5时必填,其他情况可为空',
  `dznd` decimal(3, 0) NULL DEFAULT NULL COMMENT '地质年代:参照地层代号表1-4-2,如古生代二叠纪晚二叠世长兴期上传40',
  `dzcy` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '地质成因:文字描述,可为空',
  `ttqtxx` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '土体其他信息:文字描述,可为空',
  `zt` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '状态:当soilname=1(粘性土)时必填,其他情况可为空',
  `sd` decimal(5, 2) NULL DEFAULT NULL COMMENT '湿度:当soilname=2(粉土)时必填,其他情况可为空',
  `msd` decimal(5, 2) NULL DEFAULT NULL COMMENT '密实度:当soilname=2(粉土)、3(砂土)、4(粗粒土)时必填,其他情况可为空',
  `jp` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '级配:当soilname=3(砂土)、4(粗粒土)时必填,其他情况可为空',
  `md` decimal(5, 2) NULL DEFAULT NULL COMMENT '密度:单位g/cm³,物理力学指标,不可为空',
  `hsl` decimal(5, 2) NULL DEFAULT NULL COMMENT '含水量:单位%,不可为空',
  `ysml` decimal(5, 2) NULL DEFAULT NULL COMMENT '压缩模量:单位MPa,可为空',
  `zbbs` decimal(5, 2) NULL DEFAULT NULL COMMENT '纵波波速:单位km/s,填写0时默认空,可为空',
  `basicwylevel` decimal(1, 0) NULL DEFAULT NULL COMMENT '围岩基本分级:I-VI',
  `shenshuiliang` decimal(3, 0) NULL DEFAULT NULL COMMENT '渗水量:L/(min·10m)',
  `dxspd` decimal(1, 0) NULL DEFAULT NULL COMMENT '地下水评定:(1:潮湿;2:淋雨;3:涌流)',
  `ms` decimal(6, 2) NULL DEFAULT NULL COMMENT '埋深H(m)',
  `pgjz` decimal(3, 0) NULL DEFAULT NULL COMMENT '评估基准:Rc/σmax',
  `dzgzyl` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '地质构造应力状态:文字描述',
  `csdylqt` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '初始地应力状态其他描述',
  `csdylpd` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '初始地应力评定:(1:一般;2:高;3:极高)',
  `fixwylevel` decimal(1, 0) NULL DEFAULT NULL COMMENT '修正后围岩级别:1-6',
  `zzmms` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '掌子面简要描述',
  `zzmsmpic` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '掌子面素描流水号:file_uploads.serialno',
  `images` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作业现场图流水号序列:serialno#serialno...',
  `addition` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '附件流水号序列:serialno#serialno...',
  `gmt_create` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  `gmt_modified` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  `dkname` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '里程冠号',
  `dkilo` decimal(10, 2) NULL DEFAULT NULL COMMENT '起点里程值(m)',
  `site_pk` bigint(0) NULL DEFAULT NULL COMMENT '工点主键',
  `monitordate` datetime(0) NULL DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  PRIMARY KEY (`zzmsm_pk`) USING BTREE,
  UNIQUE INDEX `uk_zzmsm_id`(`zzmsm_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '掌子面素描数据表';

-- ----------------------------
-- Records of t_zzmsm
-- ----------------------------
BEGIN;
INSERT INTO `t_zzmsm` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 12:00:28', '2025-10-28 12:00:28', NULL, NULL, NULL, NULL), (2, 2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-28 12:00:33', '2025-10-28 12:00:33', NULL, NULL, NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
