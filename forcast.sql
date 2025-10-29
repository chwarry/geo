DROP DATABASE IF EXISTS geo_forecast_mis_db;

CREATE DATABASE geo_forecast_mis_db CHARSET utf8mb4 COLLATE utf8mb4_general_ci;

USE geo_forecast_mis_db;

-- 1. 删除TSP相关子表(依赖t_tsp)
DROP TABLE IF EXISTS t_tsp_pddata;

DROP TABLE IF EXISTS t_tsp_bxdata;

-- 2. 删除物探法相关子表(依赖t_wtf)
DROP TABLE IF EXISTS t_tsp;

DROP TABLE IF EXISTS t_hsp;

DROP TABLE IF EXISTS t_ldsn;

DROP TABLE IF EXISTS t_dcbfs;

DROP TABLE IF EXISTS t_gfbzld;

DROP TABLE IF EXISTS t_sbdc;

DROP TABLE IF EXISTS t_wzjc;

-- 3. 删除钻探法相关子表(依赖t_ztf)
DROP TABLE IF EXISTS t_ztf_zkzz;

DROP TABLE IF EXISTS t_ztf_ztjlb;

DROP TABLE IF EXISTS t_ztf_dcxx;

DROP TABLE IF EXISTS t_ztf_jspk;

-- 4. 删除地质预报相关表(依赖t_site/t_gzw)
DROP TABLE IF EXISTS t_ztf;

DROP TABLE IF EXISTS t_zzmsm;

DROP TABLE IF EXISTS t_dssm;

DROP TABLE IF EXISTS t_dbbc;

DROP TABLE IF EXISTS t_sjyb;

DROP TABLE IF EXISTS t_sjwydj;

DROP TABLE IF EXISTS t_sjdz;

DROP TABLE IF EXISTS t_ybjg;

DROP TABLE IF EXISTS t_yb;

-- 5. 删除关联表(依赖t_yb/t_zhjl)
DROP TABLE IF EXISTS t_zhjl_yb;

DROP TABLE IF EXISTS t_zhjl;

-- 6. 删除物探法主表(t_wtf)
DROP TABLE IF EXISTS t_wtf;

-- 7. 删除工点/构筑物/标段表(依赖t_bd/t_gzw)
DROP TABLE IF EXISTS t_site;

DROP TABLE IF EXISTS t_gzw;

DROP TABLE IF EXISTS t_bd;

DROP TABLE IF EXISTS t_user_bd;

-- 8. 删除用户相关表
DROP TABLE IF EXISTS t_user;

DROP TABLE IF EXISTS t_department;

DROP TABLE IF EXISTS t_role_permission;

DROP TABLE IF EXISTS t_user_role;

DROP TABLE IF EXISTS t_permission;

DROP TABLE IF EXISTS t_role;

-- =========================
-- 部门/用户/角色/权限
-- =========================
CREATE TABLE t_department (
  department_pk BIGINT AUTO_INCREMENT COMMENT '部门表主键',
  department_id BIGINT DEFAULT NULL COMMENT '部门id:部门唯一标识',
  department_name VARCHAR(255) DEFAULT NULL COMMENT '部门名称:中文部门全称',
  shortname VARCHAR(255) DEFAULT NULL COMMENT '部门简称:可为空',
  parent_id BIGINT DEFAULT NULL COMMENT '父部门id:上级部门ID',
  department_priority INT DEFAULT 0 COMMENT '排序:用于前端排序',
  useFlag TINYINT DEFAULT '1' COMMENT '使用标志:1在用;0删除',
  PRIMARY KEY (department_pk),
  UNIQUE KEY uk_department_id (department_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '部门表';

CREATE TABLE t_user (
  user_pk BIGINT AUTO_INCREMENT COMMENT '用户表主键',
  user_id VARCHAR(20) DEFAULT NULL COMMENT '用户ID',
  account VARCHAR(50) DEFAULT NULL COMMENT '账号:登录平台账号',
  realname VARCHAR(255) DEFAULT NULL COMMENT '姓名:真实姓名',
  department_id BIGINT DEFAULT NULL COMMENT '部门id',
  useflag TINYINT DEFAULT 1 COMMENT '删除标识:1在用;0删除',
  telephone VARCHAR(11) DEFAULT NULL COMMENT '电话:手机号或座机',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (user_pk),
  UNIQUE KEY uk_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '用户表';

CREATE TABLE t_role (
  role_pk BIGINT AUTO_INCREMENT COMMENT '角色表主键',
  role_key VARCHAR(50) NOT NULL COMMENT '角色标识(ROLE_ADMIN,ROLE_USER)',
  role_name VARCHAR(100) NOT NULL COMMENT '角色名称(系统管理员,普通操作员)',
  role_desc VARCHAR(255) DEFAULT NULL COMMENT '角色描述',
  useflag TINYINT DEFAULT 1 COMMENT '删除标识:1在用;0删除',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (role_pk),
  UNIQUE KEY uk_role_key (role_key)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '角色表';

CREATE TABLE t_permission (
  permission_pk BIGINT AUTO_INCREMENT COMMENT '权限表主键',
  permission_key VARCHAR(100) NOT NULL COMMENT '权限标识(sys:user:list,sys:dept:add)',
  permission_name VARCHAR(100) NOT NULL COMMENT '权限名称(用户列表查询、部门新增等)',
  resource_url VARCHAR(255) DEFAULT NULL COMMENT '资源路径(接口URL,如 /api/user/**)',
  request_method VARCHAR(10) DEFAULT NULL COMMENT '请求方法(GET/POST/PUT/DELETE,空表示不限)',
  permission_desc VARCHAR(255) DEFAULT NULL COMMENT '权限描述',
  useflag TINYINT DEFAULT 1 COMMENT '删除标识:1在用;0删除',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (permission_pk),
  UNIQUE KEY uk_permission_key (permission_key)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '权限表';

CREATE TABLE t_user_role (
  user_role_pk BIGINT AUTO_INCREMENT COMMENT '关联表主键',
  user_pk BIGINT NOT NULL COMMENT '用户表主键(关联t_user.user_pk)',
  role_pk BIGINT NOT NULL COMMENT '角色表主键(关联t_role.role_pk)',
  useflag TINYINT DEFAULT 1 COMMENT '删除标识:1在用;0删除',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (user_role_pk),
  UNIQUE KEY uk_user_role (user_pk, role_pk)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '用户-角色关联表';

CREATE TABLE t_role_permission (
  role_permission_pk BIGINT AUTO_INCREMENT COMMENT '关联表主键',
  role_pk BIGINT NOT NULL COMMENT '角色表主键(关联t_role.role_pk)',
  permission_pk BIGINT NOT NULL COMMENT '权限表主键(关联t_permission.permission_pk)',
  useflag TINYINT DEFAULT 1 COMMENT '删除标识:1在用;0删除',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (role_permission_pk),
  UNIQUE KEY uk_role_permission (role_pk, permission_pk)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '角色-权限关联表';

-- =========================
-- 标段
-- =========================
CREATE TABLE t_bd (
  bd_pk BIGINT AUTO_INCREMENT COMMENT '标段表主键',
  bd_id VARCHAR(20) DEFAULT NULL COMMENT '标段ID:唯一标识',
  bdname VARCHAR(255) DEFAULT NULL COMMENT '标段名称:标段名称',
  bdcode VARCHAR(50) DEFAULT NULL COMMENT '标段编码:);标段编码',
  xm_id VARCHAR(20) DEFAULT NULL COMMENT '项目ID:项目ID',
  xmcode VARCHAR(50) DEFAULT NULL COMMENT '项目编码:项目编码',
  xmname VARCHAR(255) DEFAULT NULL COMMENT '项目名称:项目名称',
  jsdanwei VARCHAR(255) DEFAULT NULL COMMENT '建设单位:建设单位',
  sgdanwei VARCHAR(255) DEFAULT NULL COMMENT '施工单位:施工单位',
  jldanwei VARCHAR(255) DEFAULT NULL COMMENT '监理单位:监理单位',
  bd_start_kilo VARCHAR(20) DEFAULT NULL COMMENT '标段开始里程:标段的开始里程值',
  bd_stop_kilo VARCHAR(20) DEFAULT NULL COMMENT '标段结束里程:标段的结束里程值',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (bd_pk),
  UNIQUE KEY uk_bd_id (bd_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '标段表';

-- =========================
-- 用户-标段表(n:n)
-- =========================
CREATE TABLE t_user_bd (
  user_pk BIGINT NOT NULL COMMENT '用户主键',
  bd_pk BIGINT NOT NULL COMMENT '标段主键',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '用户-标段关联表';

-- =========================
-- 构筑物
-- =========================
CREATE TABLE t_gzw (
  gzw_pk BIGINT AUTO_INCREMENT COMMENT '构筑物主键',
  gzw_id VARCHAR(20) DEFAULT NULL COMMENT '构筑物ID:构筑物ID',
  bd_pk BIGINT DEFAULT NULL COMMENT '标段表主键',
  gzwname VARCHAR(255) DEFAULT NULL COMMENT '构筑物名称:构筑物名称',
  gzw_start_kilo VARCHAR(20) DEFAULT NULL COMMENT '开始里程:构筑物的开始里程值',
  gzw_stop_kilo VARCHAR(20) DEFAULT NULL COMMENT '结束里程:构筑物的结束里程值',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (gzw_pk),
  UNIQUE KEY uk_gzw_id (gzw_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '构筑物表';

-- =========================
-- 工点
-- =========================
CREATE TABLE t_site (
  site_pk BIGINT AUTO_INCREMENT COMMENT '工点主键',
  site_id VARCHAR(20) DEFAULT NULL COMMENT '隧道工点ID:隧道工点ID',
  gzw_pk BIGINT COMMENT '构筑物主键',
  sitename VARCHAR(255) DEFAULT NULL COMMENT '隧道工点名称:隧道工点名称',
  sitecode VARCHAR(20) DEFAULT NULL COMMENT '隧道工点编码:隧道工点编码',
  site_start_kilo VARCHAR(20) DEFAULT NULL COMMENT '开始里程:工点的开始里程值',
  site_stop_kilo VARCHAR(20) DEFAULT NULL COMMENT '结束里程:工点的结束里程值',
  useflag TINYINT DEFAULT NULL COMMENT '工点状态 0:已删除 1:在用',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (site_pk),
  UNIQUE KEY uk_site_id (site_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '工点表';

-- =========================
-- 设计预报
-- =========================
CREATE TABLE t_sjyb (
  sjyb_pk BIGINT AUTO_INCREMENT COMMENT '设计预报主键',
  sjyb_id BIGINT DEFAULT NULL COMMENT '设计预报ID',
  site_pk BIGINT COMMENT '工点主键',
  method DECIMAL(2, 0) DEFAULT 0 COMMENT '预报方法:(0:其他;1:地震波反射;2:水平声波剖面;3:陆地声呐;4:电磁波反射;5:高分辨直流电;6:瞬变电磁;7:掌子面素描;8:洞身素描;12:地表补充地质调查;13:超前水平钻;14:加深炮孔;99:全部;)',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '起点里程值(m)',
  sjyb_length DECIMAL(10, 2) DEFAULT NULL COMMENT '长度(m)',
  zxms DECIMAL(6, 2) DEFAULT NULL COMMENT '最小埋深(m)',
  zksl INT DEFAULT NULL COMMENT '钻孔数量:(当method=13或14时必填)',
  qxsl INT DEFAULT NULL COMMENT '取芯数量:(当method=13时必填)',
  revise VARCHAR(512) DEFAULT NULL COMMENT '修改原因说明:(type!=1 时必填)',
  username VARCHAR(50) DEFAULT NULL COMMENT '填写人账号',
  plantime DATETIME DEFAULT NULL COMMENT '填写时间:(终端平台入库时间)',
  plannum INT DEFAULT NULL COMMENT '设计预报次数',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (sjyb_pk),
  UNIQUE KEY uk_sjyb_id (sjyb_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '设计预报方法表';

-- =========================
-- 设计围岩等级
-- =========================
CREATE TABLE t_sjwydj (
  sjwydj_pk BIGINT AUTO_INCREMENT COMMENT '设计围岩等级主键',
  sjwydj_id BIGINT DEFAULT NULL COMMENT '设计围岩等级ID',
  site_pk BIGINT COMMENT '工点主键',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '起点里程值(m)',
  sjwydj_length DECIMAL(10, 2) DEFAULT NULL COMMENT '长度(m)',
  wydj DECIMAL(1, 0) DEFAULT NULL COMMENT '围岩等级(1-6)',
  revise VARCHAR(512) DEFAULT NULL COMMENT '修改说明',
  username VARCHAR(20) DEFAULT NULL COMMENT '操作人账号',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (sjwydj_pk),
  UNIQUE KEY uk_sjwydj_id (sjwydj_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '设计围岩等级表';

-- =========================
-- 设计地质
-- =========================
CREATE TABLE t_sjdz (
  sjdz_pk BIGINT AUTO_INCREMENT COMMENT '设计地质主键',
  sjdz_id BIGINT DEFAULT NULL COMMENT '设计地质ID',
  site_pk BIGINT COMMENT '工点主键',
  method DECIMAL(1, 0) DEFAULT NULL COMMENT '影响因素:(1:岩溶发育度;2:瓦斯影响度;3:地应力影响度;4:涌水涌泥程度;5:断层稳定程度)',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '起点里程值(m)',
  sjdz_length DECIMAL(10, 2) DEFAULT NULL COMMENT '长度(m)',
  dzxxfj DECIMAL(1, 0) DEFAULT NULL COMMENT '复杂程度分级(1简单..4复杂)',
  revise VARCHAR(512) DEFAULT NULL COMMENT '修改原因(type!=1 必填)',
  username VARCHAR(20) DEFAULT NULL COMMENT '操作人账号',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (sjdz_pk),
  UNIQUE KEY uk_sjdz_id (sjdz_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '设计地质信息表';

-- =========================
-- 综合结论
-- =========================
CREATE TABLE t_zhjl (
  zhjl_pk BIGINT AUTO_INCREMENT COMMENT '综合结论主键',
  zhjl_id BIGINT DEFAULT NULL COMMENT '综合结论ID',
  remark TEXT DEFAULT NULL COMMENT '综合结论简述',
  addition VARCHAR(512) DEFAULT NULL COMMENT '附件(综合结论报告)流水号序列',
  warndealflag TINYINT DEFAULT 0 COMMENT '处置状态:(0:未处置;1:已处置)',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (zhjl_pk),
  UNIQUE KEY uk_zhjl_id (zhjl_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '综合结论表';

-- =========================
-- 综合结论-预报分段信息(1:n)
-- =========================
CREATE TABLE t_zhjl_yb (
  zhjl_pk BIGINT COMMENT '综合结论主键',
  yb_pk BIGINT COMMENT '预报分段信息主键'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '综合结论-预报段表';

-- =========================
-- 综合结论-处置信息
-- =========================
CREATE TABLE t_zhjl_czxx (
  zhjl_czxx_pk BIGINT AUTO_INCREMENT COMMENT '处置信息主键',
  zhjl_czxx_id BIGINT DEFAULT NULL COMMENT '处置信息ID',
  zhjl_pk BIGINT DEFAULT NULL COMMENT '综合结论主键',
  handletype DECIMAL(1, 0) DEFAULT NULL COMMENT '处置状态:(1=未处置,2=已处置)',
  handleresult DECIMAL(1, 0) DEFAULT NULL COMMENT '处置结果:(1=与原设计一致,2=需变更原设计)',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '处置时里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '处置时掌子面里程值(m)',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改时间',
  PRIMARY KEY (zhjl_czxx_pk),
  UNIQUE KEY uk_zhjl_czxx_id (zhjl_czxx_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '综合结论-处置信息表';

-- =========================
-- 综合结论-处置信息-处置内容
-- =========================
CREATE TABLE t_zhjl_czxx_cznr (
  zhjl_czxx_cznr_pk BIGINT AUTO_INCREMENT COMMENT '处置内容主键',
  zhjl_czxx_pk BIGINT DEFAULT NULL COMMENT '处置信息主键',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '处置时里程冠号',
  sdkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '开始里程值',
  edkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '结束里程值',
  yj_time DATETIME DEFAULT NULL COMMENT '预警时间:精确至秒,格式YYYY-MM-DD HH:MM:SS',
  risklevel VARCHAR(20) DEFAULT NULL COMMENT '风险类别:(1=破碎带;2=岩溶;3=瓦斯;4=涌水;5=突泥;6=地应力;7=采空区;8=岩爆;0=其他(绿色无风险,其他颜色为其他风险);多个用#分隔,如1#2#3)',
  grade DECIMAL(1, 0) DEFAULT NULL COMMENT '地质级别:(1=红色;2=黄色;0=绿色;多个用#分隔,如1#2#0,个数与风险类别对应)',
  wylevel DECIMAL(1, 0) DEFAULT NULL COMMENT '围岩等级:(1=Ⅰ级,2=Ⅱ级,3=Ⅲ级,4=Ⅳ级,5=Ⅴ级,6=Ⅵ级)',
  jlresult VARCHAR(1024) DEFAULT NULL COMMENT '探测结论:文字描述',
  PRIMARY KEY (zhjl_czxx_cznr_pk),
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改时间'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '综合结论-处置信息表';

-- =========================
-- 预报分段信息
-- =========================
CREATE TABLE t_yb (
  yb_pk BIGINT AUTO_INCREMENT COMMENT '预报分段信息主键',
  yb_id BIGINT DEFAULT NULL COMMENT '预报分段信息ID',
  site_pk BIGINT COMMENT '工点主键',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号:如,正线:DK;左线ZDK;右线:YDK;比较线DIK等',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '掌子面里程值',
  yb_length DECIMAL(8, 2) DEFAULT NULL COMMENT '预报长度',
  monitordate DATETIME DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  createdate DATETIME DEFAULT NULL COMMENT '上传日期:格式:YYYY-MM-DD HH24:MI:SS',
  testname VARCHAR(20) DEFAULT NULL COMMENT '检测人姓名:检测人姓名',
  testno VARCHAR(18) DEFAULT NULL COMMENT '检测人身份证:检测人身份证号码',
  testtel VARCHAR(18) DEFAULT NULL COMMENT '检测人电话:检测人联系电话',
  monitorname VARCHAR(20) DEFAULT NULL COMMENT '复核人姓名:复核人姓名',
  monitorno VARCHAR(18) DEFAULT NULL COMMENT '复核人身份证:复核人身份证号码',
  monitortel VARCHAR(18) DEFAULT NULL COMMENT '复核人电话:复核人联系电话',
  supervisorname VARCHAR(20) DEFAULT NULL COMMENT '现场监理人员:监理人员姓名',
  supervisorno VARCHAR(18) DEFAULT NULL COMMENT '监理人员身份证:监理人员身份证号码',
  supervisortel VARCHAR(18) DEFAULT NULL COMMENT '监理人员电话:监理人员联系电话',
  conclusionyb TEXT DEFAULT NULL COMMENT '预报结论:文字描述',
  suggestion TEXT DEFAULT NULL COMMENT '后续建议:文字描述',
  solution TEXT DEFAULT NULL COMMENT '实际采取措施:文字描述',
  remark TEXT DEFAULT NULL COMMENT '备注:文字描述',
  method DECIMAL(1, 0) DEFAULT NULL COMMENT '预报方法:1=TSP;2=HSP;3=陆地声纳;4=电磁波反射;5=高分辨直流电;7=掌子面素描;8=洞身素描;12=地表信息;13=超前水平钻;14=加深炮孔',
  flag TINYINT (1) DEFAULT NULL COMMENT '使用标识:(0=在用;1=删除)',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间:数据库自动维护',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间:数据库自动维护',
  PRIMARY KEY (yb_pk),
  UNIQUE KEY uk_yb_id (yb_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '预报分段信息表';

-- =========================
-- 预报结果分段信息
-- =========================
CREATE TABLE t_ybjg (
  ybjg_pk BIGINT AUTO_INCREMENT COMMENT '预报结果主键',
  ybjg_id BIGINT DEFAULT NULL COMMENT '预报结果ID',
  yb_pk BIGINT COMMENT '预报分段信息主键',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  sdkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '开始里程值',
  edkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '结束里程值',
  ybjg_time DATETIME DEFAULT NULL COMMENT '产生时间:精确至秒,格式YYYY-MM-DD HH:MM:SS',
  risklevel VARCHAR(20) DEFAULT NULL COMMENT '风险类别:(1=破碎带;2=岩溶;3=瓦斯;4=涌水;5=突泥;6=地应力;7=采空区;8=岩爆;0=其他(绿色无风险,其他颜色为其他风险);多个用#分隔,如1#2#3)',
  grade DECIMAL(1, 0) DEFAULT NULL COMMENT '地质级别:(1=红色;2=黄色;0=绿色;多个用#分隔,如1#2#0,个数与风险类别对应)',
  wylevel DECIMAL(1, 0) DEFAULT NULL COMMENT '围岩等级:(1=Ⅰ级,2=Ⅱ级,3=Ⅲ级,4=Ⅳ级,5=Ⅴ级,6=Ⅵ级)',
  jlresult VARCHAR(1024) DEFAULT NULL COMMENT '探测结论:文字描述',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改时间',
  PRIMARY KEY (ybjg_pk),
  UNIQUE KEY uk_ybjg_id (ybjg_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '预报结果分段信息表';

-- =========================
-- 物探法
-- =========================
CREATE TABLE t_wtf (
  wtf_pk BIGINT AUTO_INCREMENT COMMENT '物探法主键',
  wtf_id VARCHAR(20) DEFAULT NULL COMMENT '物探法数据记录ID',
  site_pk BIGINT COMMENT '工点主键',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '掌子面里程',
  monitordate DATETIME DEFAULT NULL COMMENT '预报时间:格式:YYYY-MM-DD HH24:MI:SS',
  wtf_length DECIMAL(10, 2) DEFAULT NULL COMMENT '预报长度(m)',
  yb_pk BIGINT COMMENT '预报分段信息主键',
  method DECIMAL(1, 0) DEFAULT NULL COMMENT '预报方法:(1:TSP;2:HSP;3:陆地声纳;4:电磁波反射;5:高分辨直流电;6:瞬变电磁;9:微震监测预报;0:其他)',
  -- 附件及成果信息
  originalfile VARCHAR(1024) DEFAULT NULL COMMENT '原始文件流水号序列',
  addition VARCHAR(1024) DEFAULT NULL COMMENT '附件(其他报告)流水号序列',
  images VARCHAR(1024) DEFAULT NULL COMMENT '作业现场图流水号序列',
  gcxtpic VARCHAR(1024) DEFAULT NULL COMMENT '观测系统布置图流水号',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (wtf_pk),
  UNIQUE KEY uk_wtf_id (wtf_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '物探法基本表';

-- =========================
-- 地震波反射 TSP
-- =========================
CREATE TABLE t_tsp (
  tsp_pk BIGINT AUTO_INCREMENT COMMENT 'TSP主键',
  tsp_id VARCHAR(20) DEFAULT NULL COMMENT 'TSP数据ID',
  wtf_pk BIGINT COMMENT '物探法主键',
  -- 孔位布置
  jfpknum DECIMAL(2, 0) DEFAULT NULL COMMENT '激发孔个数:两位整数',
  jfpksd DECIMAL(3, 1) DEFAULT NULL COMMENT '激发孔平均深度:保留1位小数,整数位≤2位(单位:m)',
  jfpkzj DECIMAL(3, 1) DEFAULT NULL COMMENT '激发孔平均直径:保留1位小数,整数位≤2位(单位:mm)',
  jfpkjdmgd DECIMAL(3, 1) DEFAULT NULL COMMENT '激发孔距底面平均高度:保留1位小数,整数位≤2位(单位:m)',
  jfpkjj DECIMAL(3, 1) DEFAULT NULL COMMENT '激发孔间距:保留1位小数,整数位≤2位(单位:m)',
  jspknum DECIMAL(2, 0) DEFAULT NULL COMMENT '接收孔个数:整数',
  jspksd DECIMAL(3, 1) DEFAULT NULL COMMENT '接收孔平均深度:保留1位小数,整数位≤2位(单位:m)',
  jspkzj DECIMAL(3, 1) DEFAULT NULL COMMENT '接收孔平均直径:保留1位小数,整数位≤2位(单位:mm)',
  jspkjdmgd DECIMAL(3, 1) DEFAULT NULL COMMENT '接收孔距底面平均高度:保留1位小数,整数位≤2位(单位:m)',
  sb_name VARCHAR(20) DEFAULT NULL COMMENT '设备名称 如:TSP 203plus',
  -- 接收孔信息
  kwwz DECIMAL(1, 0) DEFAULT NULL COMMENT '炮孔布置 1:面向掌子面左边墙 2:面向掌子面右边墙',
  leftkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '左里程:保留2位小数(单位:m,如DK215+763.32记为215763.32)',
  rightkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '右里程:保留2位小数(单位:m,如DK215+763.32记为215763.32)',
  leftjgdczjl DECIMAL(3, 1) DEFAULT NULL COMMENT '左距拱顶垂直距离:保留1位小数,整数位≤2位(单位:m)',
  rightjgdczjl DECIMAL(3, 1) DEFAULT NULL COMMENT '右距拱顶垂直距离:保留1位小数,整数位≤2位(单位:m)',
  leftzxjl DECIMAL(3, 1) DEFAULT NULL COMMENT '左距中线距离:整数位≤2位(单位:m)',
  rightzxjl DECIMAL(3, 1) DEFAULT NULL COMMENT '右距中线距离:保留1位小数,整数位≤2位(单位:m)',
  leftjdmgd DECIMAL(3, 1) DEFAULT NULL COMMENT '左距地面高度:保留1位小数,整数位≤2位(单位:m)',
  rightjdmgd DECIMAL(3, 1) DEFAULT NULL COMMENT '右距地面高度:保留1位小数,整数位≤2位(单位:m)',
  leftks DECIMAL(3, 1) DEFAULT NULL COMMENT '左孔深:保留1位小数,整数位≤2位(单位:m)',
  rightks DECIMAL(3, 1) DEFAULT NULL COMMENT '右孔深:保留1位小数,整数位≤2位(单位:m)',
  leftqj DECIMAL(4, 1) DEFAULT NULL COMMENT '左倾角:保留1位小数,整数位≤3位(单位:°,向上为正、向下为负)',
  rightqj DECIMAL(4, 1) DEFAULT NULL COMMENT '右倾角:保留1位小数,整数位≤3位(单位:°,向上为正、向下为负)',
  -- 成果图
  pic1 VARCHAR(255) DEFAULT NULL COMMENT '波速分布图',
  pic2 VARCHAR(255) DEFAULT NULL COMMENT '岩土物性图',
  pic3 VARCHAR(255) DEFAULT NULL COMMENT 'X云图',
  pic4 VARCHAR(255) DEFAULT NULL COMMENT 'Y云图',
  pic5 VARCHAR(255) DEFAULT NULL COMMENT 'Z云图',
  pic6 VARCHAR(255) DEFAULT NULL COMMENT '2D成果图',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间 记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间 记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (tsp_pk),
  UNIQUE KEY uk_tsp_id (tsp_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'TSP观测系统及设备信息孔位信息表';

-- =========================
-- 炮点参数
-- =========================
CREATE TABLE t_tsp_pddata (
  tsp_pddata_pk BIGINT AUTO_INCREMENT COMMENT '炮点参数主键',
  tsp_pddata_id BIGINT DEFAULT NULL COMMENT '炮点参数ID',
  tsp_pk BIGINT COMMENT 'TSP主键',
  pdjl DECIMAL(3, 1) DEFAULT NULL COMMENT '距离:单位:m,保留1位小数,炮点到接收器的距离,整数位≤2位',
  pdsd DECIMAL(3, 1) DEFAULT NULL COMMENT '深度:单位:m,保留1位小数,整数位≤2位',
  height DECIMAL(3, 1) DEFAULT NULL COMMENT '高度:单位:m,保留1位小数,整数位≤2位',
  qj DECIMAL(4, 1) DEFAULT NULL COMMENT '倾角:沿轴径向,向下为正,向上为负,保留1位小数,整数位≤3位',
  fwj DECIMAL(4, 1) DEFAULT NULL COMMENT '方位角:孔洞方向的方位角,保留1位小数,整数位≤3位',
  yl DECIMAL(6, 1) DEFAULT NULL COMMENT '药量:单位:g,不可超过5位数',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (tsp_pddata_pk),
  UNIQUE KEY uk_tsp_pddata_id (tsp_pddata_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'TSP炮点参数表';

-- =========================
-- 围岩岩体物理学参数表
-- =========================
CREATE TABLE t_tsp_bxdata (
  tsp_bxdata_pk BIGINT AUTO_INCREMENT COMMENT '围岩参数主键',
  tsp_bxdata_id BIGINT DEFAULT NULL COMMENT '围岩参数ID',
  tsp_pk BIGINT COMMENT 'TSP主键',
  jbq VARCHAR(10) DEFAULT NULL COMMENT '检波器 检波器名称或编号',
  jbxh VARCHAR(10) DEFAULT NULL COMMENT '检波器序号 检波器序号',
  bx DECIMAL(1, 0) DEFAULT NULL COMMENT '波型 1:P波; 2:SV波; 3:SH波',
  sdlcz DECIMAL(10, 2) DEFAULT NULL COMMENT '断面里程值 检波器所在断面里程值,单位:m,保留2位小数',
  bs DECIMAL(8, 2) DEFAULT NULL COMMENT '速度 单位:m/s',
  vps DECIMAL(8, 2) DEFAULT NULL COMMENT 'VP/VS 保留2位小数',
  bsb DECIMAL(8, 2) DEFAULT NULL COMMENT '泊松比 保留2位小数',
  md DECIMAL(8, 2) DEFAULT NULL COMMENT '密度 单位:g/cm³,保留2位小数',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间 记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间 记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (tsp_bxdata_pk),
  UNIQUE KEY uk_tsp_bxdata_id (tsp_bxdata_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'TSP围岩岩体物理学参数表';

-- =========================
-- 水平波剖面 hsp
-- =========================
CREATE TABLE t_hsp (
  hsp_pk BIGINT AUTO_INCREMENT COMMENT 'HSP主键',
  hsp_id BIGINT DEFAULT NULL COMMENT 'HSP数据ID',
  wtf_pk BIGINT COMMENT '物探法主键',
  cqnum DECIMAL(2, 0) DEFAULT NULL COMMENT '测区数量:两位数整数',
  cdnum DECIMAL(2, 0) DEFAULT NULL COMMENT '测区测点数量:两位数整数',
  jsfs VARCHAR(50) DEFAULT NULL COMMENT '接收方式:文字描述',
  sb_name VARCHAR(20) DEFAULT NULL COMMENT '设备名称:如:HSP206型',
  pic1 VARCHAR(255) DEFAULT NULL COMMENT '波形图',
  pic2 VARCHAR(255) DEFAULT NULL COMMENT '成果图',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (hsp_pk),
  UNIQUE KEY uk_hsp_id (hsp_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'HSP数据表';

-- =========================
-- 陆地声纳 
-- =========================
CREATE TABLE t_ldsn (
  ldsn_pk BIGINT AUTO_INCREMENT COMMENT '陆地声呐主键',
  ldsn_id BIGINT DEFAULT NULL COMMENT '陆地声呐ID',
  wtf_pk BIGINT COMMENT '物探法主键',
  cxnum DECIMAL(2, 0) DEFAULT NULL COMMENT '测线条数:测线的总条数',
  sb_name VARCHAR(20) DEFAULT NULL COMMENT '设备名称:陆地声呐设备的名称',
  pic1 VARCHAR(255) DEFAULT NULL COMMENT '剖面图',
  pic2 VARCHAR(255) DEFAULT NULL COMMENT '测线布置图',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (ldsn_pk),
  UNIQUE KEY uk_ldsn_id (ldsn_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '陆地声呐表';

-- =========================
-- 陆地声纳-成果数据信息
-- =========================
CREATE TABLE t_ldsn_resultinfo (
  ldsn_resultinfo_pk BIGINT AUTO_INCREMENT COMMENT '陆地声纳-成果数据信息主键',
  ldsn_resultinfo_id BIGINT DEFAULT NULL COMMENT '陆地声纳-成果数据信息ID',
  ldsn_pk BIGINT COMMENT '陆地声呐主键',
  cdxh DECIMAL(3, 0) DEFAULT NULL COMMENT '测点序号:序号由1开始递增',
  jgdjl DECIMAL(3, 1) DEFAULT NULL COMMENT '距拱顶距离:保留1位小数,整数位不能超过2位(单位:m)',
  jzxjl DECIMAL(3, 1) DEFAULT NULL COMMENT '距左线距离:保留1位小数,整数位不能超过2位(单位:m)',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (ldsn_resultinfo_pk),
  UNIQUE KEY uk_ldsn_resultinfo_id (ldsn_resultinfo_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '陆地声纳-成果数据信息表';

-- =========================
-- 电磁波反射
-- =========================
CREATE TABLE t_dcbfs (
  dcbfs_pk BIGINT AUTO_INCREMENT COMMENT '电磁波反射主键',
  dcbfs_id BIGINT DEFAULT NULL COMMENT '电磁波数据ID',
  wtf_pk BIGINT COMMENT '物探法主键',
  cxnum DECIMAL(2, 0) DEFAULT NULL COMMENT '测线数量:布置测线组数,不得超过2位整数',
  pic VARCHAR(255) DEFAULT NULL COMMENT '测线布置示意图',
  sb_name VARCHAR(20) DEFAULT NULL COMMENT '设备型号:如:SIR-20',
  gzpl DECIMAL(3, 0) DEFAULT NULL COMMENT '天线工作频率:单位Mhz,不超过3位整数',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (dcbfs_pk),
  UNIQUE KEY uk_dcbfs_id (dcbfs_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '电磁波反射数据表';

-- =========================
-- 电磁波反射-成果数据信息
-- =========================
CREATE TABLE t_dcbfs_resultinfo (
  dcbfs_resultinfo_pk BIGINT AUTO_INCREMENT COMMENT '电磁波反射-成果数据信息主键',
  dcbfs_resultinfo_id BIGINT DEFAULT NULL COMMENT '电磁波反射-成果数据信息主键ID',
  dcbfs_pk BIGINT COMMENT '电磁波反射主键',
  cxxh DECIMAL(3, 0) DEFAULT NULL COMMENT '测线序号',
  qdzbx DECIMAL(4, 0) DEFAULT NULL COMMENT '起点X坐标',
  qdzby DECIMAL(4, 0) DEFAULT NULL COMMENT '起点Y坐标',
  zdzbx DECIMAL(4, 0) DEFAULT NULL COMMENT '终点X坐标',
  zdzby DECIMAL(4, 0) DEFAULT NULL COMMENT '终点Y坐标',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (dcbfs_resultinfo_pk),
  UNIQUE KEY uk_dcbfs_resultinfo_id (dcbfs_resultinfo_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '电磁波反射-成果数据信息表';

-- =========================
-- 电磁波反射-成果图
-- =========================
CREATE TABLE t_dcbfs_resultpic (
  dcbfs_resultpic_pk BIGINT AUTO_INCREMENT COMMENT '电磁波反射-成果图主键',
  dcbfs_resultpic_id BIGINT DEFAULT NULL COMMENT '电磁波反射-成果图主键ID',
  dcbfs_pk BIGINT COMMENT '电磁波反射主键',
  cxname VARCHAR(20) DEFAULT NULL COMMENT '测线名称',
  pic1 VARCHAR(255) DEFAULT NULL COMMENT '波形图',
  pic2 VARCHAR(255) DEFAULT NULL COMMENT '波形彩图',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (dcbfs_resultpic_pk),
  UNIQUE KEY uk_dcbfs_resultpic_id (dcbfs_resultpic_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '电磁波反射-成果图表';

-- =========================
-- 高分辨直流电
-- =========================
CREATE TABLE t_gfbzld (
  gfbzld_pk BIGINT AUTO_INCREMENT COMMENT '高分辨直流电主键',
  gfbzld_id BIGINT DEFAULT NULL COMMENT '高分辨直流电数据ID',
  wtf_pk BIGINT COMMENT '物探法主键',
  gddjnum DECIMAL(2, 0) DEFAULT NULL COMMENT '供电电极数量:单位:个,不超过2位整数',
  cldjnum DECIMAL(2, 0) DEFAULT NULL COMMENT '测量电极测点数量:单位:个,不超过2位整数',
  sb_name VARCHAR(20) DEFAULT NULL COMMENT '设备名称:设备型号或名称',
  gddy DECIMAL(3, 0) DEFAULT NULL COMMENT '供电电压:单位:v,不超过3位整数',
  gddl DECIMAL(3, 0) DEFAULT NULL COMMENT '供电电流:单位:mA,不超过3位整数',
  pic1 VARCHAR(255) DEFAULT NULL COMMENT '电势等值线图',
  pic2 VARCHAR(255) DEFAULT NULL COMMENT '成果图',
  pic3 VARCHAR(255) DEFAULT NULL COMMENT '平剖图',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (gfbzld_pk),
  UNIQUE KEY uk_gfbzld_id (gfbzld_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '高分辨直流电数据表';

-- =========================
-- 高分辨直流电-成果数据信息
-- =========================
CREATE TABLE t_gfbzld_resultinfo (
  gfbzld_resultinfo_pk BIGINT AUTO_INCREMENT COMMENT '高分辨直流电-成果数据信息主键',
  gfbzld_resultinfo_id BIGINT DEFAULT NULL COMMENT '高分辨直流电-成果数据信息ID',
  gfbzld_pk BIGINT COMMENT '高分辨直流电主键',
  djxh VARCHAR(20) DEFAULT NULL COMMENT '电极序号',
  gfbzld_resultinfo_type DECIMAL(1, 0) DEFAULT NULL COMMENT '类型',
  jzzmjl DECIMAL(5, 1) DEFAULT NULL COMMENT '距掌子面距离',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (gfbzld_resultinfo_pk),
  UNIQUE KEY uk_gfbzld_resultinfo_id (gfbzld_resultinfo_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '高分辨直流电-成果数据信息表';

-- =========================
-- 瞬变电磁
-- =========================
CREATE TABLE t_sbdc (
  sbdc_pk BIGINT AUTO_INCREMENT COMMENT '瞬变电磁主键',
  sbdc_id BIGINT DEFAULT NULL COMMENT '瞬变电磁数据ID',
  wtf_pk BIGINT COMMENT '物探法主键',
  sbdc_type DECIMAL(1, 0) DEFAULT NULL COMMENT '采集装置类型:1重叠回线;2中心回线;3偶级装置',
  fskwzlc DECIMAL(10, 2) DEFAULT NULL COMMENT '发射框位置里程:单位:m,保留2位小数',
  fskc DECIMAL(5, 1) DEFAULT NULL COMMENT '发射框长:单位:m,保留1位小数',
  fskk DECIMAL(5, 1) DEFAULT NULL COMMENT '发射框宽:单位:m,保留1位小数',
  jfxqzs DECIMAL(3, 0) DEFAULT NULL COMMENT '激发线圈匝数:单位:个,不超过3位整数',
  jskc DECIMAL(5, 1) DEFAULT NULL COMMENT '接收框长:单位:m,保留1位小数',
  jskk DECIMAL(5, 1) DEFAULT NULL COMMENT '接收框宽:单位:m,保留1位小数',
  jskzs DECIMAL(3, 0) DEFAULT NULL COMMENT '接收框匝数:单位:个,不超过3位整数',
  jsxqdxmj DECIMAL(5, 1) DEFAULT NULL COMMENT '接收线圈等效面积:单位:m²,保留1位小数',
  sf DECIMAL(5, 1) NULL COMMENT '收发距:单位:m,保留1位小数,仅采集装置类型=3时必填',
  sb_name VARCHAR(20) DEFAULT NULL COMMENT '设备名称:如:PROTEM-47',
  fspl DECIMAL(5, 1) DEFAULT NULL COMMENT '发射频率:单位:Hz,保留1位小数',
  gddl DECIMAL(5, 1) DEFAULT NULL COMMENT '供电电流:单位:A,保留1位小数',
  clsj DECIMAL(5, 1) DEFAULT NULL COMMENT '测量时间:单位:s,保留1位小数',
  mqfw DECIMAL(5, 1) DEFAULT NULL COMMENT '盲区范围:单位:m,保留1位小数',
  cxbzms VARCHAR(512) DEFAULT NULL COMMENT '测线布置描述:文字描述',
  pic1 VARCHAR(255) DEFAULT NULL COMMENT '电阻率剖面图:图片格式:jpg,大小≤2M,多张流水号用#分割',
  pic2 VARCHAR(255) DEFAULT NULL COMMENT '视电阻率剖面图:图片格式:jpg,大小≤2M,多张流水号用#分割',
  pic3 VARCHAR(255) DEFAULT NULL COMMENT '作业现场图片:图片格式:jpg,大小≤2M,多张流水号用#分割',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (sbdc_pk),
  UNIQUE KEY uk_sbdc_id (sbdc_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '瞬变电磁数据表';

-- =========================
-- 微震监测预报
-- =========================
CREATE TABLE t_wzjc (
  wzjc_pk BIGINT AUTO_INCREMENT COMMENT '微震监测主键',
  wzjc_id BIGINT DEFAULT NULL COMMENT '微震监测数据ID',
  wtf_pk BIGINT COMMENT '物探法主键',
  cum_eventnum DECIMAL(8, 0) DEFAULT NULL COMMENT '累积微震事件数:单位 个,不超过8位整数',
  cum_energy DECIMAL(10, 2) DEFAULT NULL COMMENT '累积微震释放能:单位 lgE/J,保留2位小数',
  cum_appvol DECIMAL(10, 2) DEFAULT NULL COMMENT '累积微震视体积:单位 lgV/m³,保留2位小数',
  event_rate DECIMAL(10, 2) DEFAULT NULL COMMENT '微震事件率:单位 个/天,保留2位小数',
  energy_rate DECIMAL(10, 2) DEFAULT NULL COMMENT '微震释放能率:单位 lgE/J/天,保留2位小数',
  appvol_rate DECIMAL(10, 2) DEFAULT NULL COMMENT '微震视体积率:单位 lgV/m³/天,保留2位小数',
  hdtzfxyms VARCHAR(512) DEFAULT NULL COMMENT '活动特征分析与描述:文字描述',
  wzsjfbtzt VARCHAR(512) DEFAULT NULL COMMENT '预警区域内微震事件分布特征图流水号:图片格式jpg/png,大小≤10M,多张流水号用#分割',
  ljwzsjst VARCHAR(512) DEFAULT NULL COMMENT '累积微震事件数图流水号:图片格式jpg/png,大小≤10M,多张流水号用#分割',
  ljwzsflt VARCHAR(512) DEFAULT NULL COMMENT '累积微震释放能图流水号:图片格式jpg/png,大小≤10M,多张流水号用#分割',
  ljwzstjt VARCHAR(512) DEFAULT NULL COMMENT '累积微震视体积图流水号:图片格式jpg/png,大小≤10M,多张流水号用#分割',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (wzjc_pk),
  UNIQUE KEY uk_wzjc_id (wzjc_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '微震监测预报原始数据表';

-- =========================
-- 掌子面素描
-- =========================
CREATE TABLE t_zzmsm (
  zzmsm_pk BIGINT AUTO_INCREMENT COMMENT '掌子面素描主键',
  zzmsm_id BIGINT DEFAULT NULL COMMENT '掌子面素描ID',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '掌子面里程',
  site_pk BIGINT COMMENT '工点主键',
  monitordate DATETIME DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  yb_pk BIGINT COMMENT '预报分段信息主键',
  jdkjl DECIMAL(8, 2) DEFAULT NULL COMMENT '距洞口距离(m)',
  kwkd DECIMAL(5, 2) DEFAULT NULL COMMENT '开挖宽度(m)',
  kwgd DECIMAL(5, 2) DEFAULT NULL COMMENT '开挖高度(m)',
  kwmj DECIMAL(8, 2) DEFAULT NULL COMMENT '开挖面积(m2)',
  kwfs DECIMAL(1, 0) DEFAULT NULL COMMENT '开挖方式编号',
  kwfs2 VARCHAR(126) DEFAULT NULL COMMENT '开挖方式补充',
  bwnum DECIMAL(3, 0) DEFAULT NULL COMMENT '素描部位编号(参照图1-4-4)',
  zzmzt VARCHAR(512) DEFAULT NULL COMMENT '掌子面状态:文字描述',
  zzmsm_type DECIMAL(1, 0) DEFAULT NULL COMMENT '岩土特征类别:(1岩体;2土体)',
  -- 岩体数据
  ytlx VARCHAR(20) DEFAULT NULL COMMENT '岩体类型(名称):岩体名称',
  njl DECIMAL(3, 1) DEFAULT NULL COMMENT '黏聚力:单位MPa,可为空',
  nfcj DECIMAL(3, 1) DEFAULT NULL COMMENT '内摩擦角:单位°,可为空',
  dzbhkyqd DECIMAL(3, 1) DEFAULT NULL COMMENT '单轴饱和抗压强度:单位MPa,可为空',
  dhzqdjx DECIMAL(5, 1) DEFAULT NULL COMMENT '点荷载强度极限:单位MPa,可为空',
  bxml DECIMAL(3, 1) DEFAULT NULL COMMENT '变形模量:单位GPa,可为空',
  bsb DECIMAL(5, 2) DEFAULT NULL COMMENT '泊松比:可为空',
  trzd DECIMAL(3, 1) DEFAULT NULL COMMENT '天然重度:单位kN/m³,可为空',
  yxzbqt VARCHAR(512) DEFAULT NULL COMMENT '岩性指标其他:文字描述,岩性指标补充说明,可为空',
  yxzbpd DECIMAL(1, 0) DEFAULT NULL COMMENT '岩性指标评定:1=极硬岩;2=硬岩;3=较软岩;4=软岩;5=极软岩',
  dzgzyxcd DECIMAL(1, 0) DEFAULT NULL COMMENT '地质构造影响程度:1=轻微;2=较重;3=严重;4=极严重',
  jgmzs DECIMAL(1, 0) DEFAULT NULL COMMENT '结构面组数:无单位,整数',
  pjjj DECIMAL(3, 1) DEFAULT NULL COMMENT '平均间距:单位m,保留1位小数',
  zyjgmcz VARCHAR(100) DEFAULT NULL COMMENT '主要结构面产状:格式XX°∠XX°,允许多个用#分隔(如1#2λ1#2λ1#2)',
  qtjgmcz VARCHAR(100) DEFAULT NULL COMMENT '其他结构面产状:格式XX°∠XX°,允许多个用#分隔,可为空',
  ysx DECIMAL(1, 0) DEFAULT NULL COMMENT '延伸性:1=极差;2=差;3=中等;4=好;5=极好',
  ccd DECIMAL(1, 0) DEFAULT NULL COMMENT '粗糙度:1=明显台阶状;2=粗糙波纹状;3=平正光滑有擦痕;4=平整光滑',
  zkd DECIMAL(5, 2) DEFAULT NULL COMMENT '张开度:单位mm,保留2位小数',
  tchjz VARCHAR(512) DEFAULT NULL COMMENT '填充和胶结:文字描述,可为空',
  fxcd DECIMAL(1, 0) DEFAULT NULL COMMENT '风化程度:1=未风化;2=微风化;3=弱风化;4=强风化;5=全风化',
  ytwzsm VARCHAR(512) DEFAULT NULL COMMENT '岩体完整说明:岩体完整状态简要说明,可为空',
  ytwzztpd DECIMAL(1, 0) DEFAULT NULL COMMENT '岩体完整状态评定:1=完整;2=较完整;3=较破碎;4=破碎;5=极破碎',
  -- 土体数据
  soilname DECIMAL(1, 0) DEFAULT NULL COMMENT '土名称:1=粘性土;2=粉土;3=砂土;4=粗粒土;5=其他',
  soilname2 VARCHAR(20) DEFAULT NULL COMMENT '土名称补充:当soilname=5时必填,其他情况可为空',
  dznd DECIMAL(3, 0) DEFAULT NULL COMMENT '地质年代:参照地层代号表1-4-2,如古生代二叠纪晚二叠世长兴期上传40',
  dzcy VARCHAR(512) DEFAULT NULL COMMENT '地质成因:文字描述,可为空',
  ttqtxx VARCHAR(512) DEFAULT NULL COMMENT '土体其他信息:文字描述,可为空',
  zt VARCHAR(512) DEFAULT NULL COMMENT '状态:当soilname=1(粘性土)时必填,其他情况可为空',
  sd DECIMAL(5, 2) DEFAULT NULL COMMENT '湿度:当soilname=2(粉土)时必填,其他情况可为空',
  msd DECIMAL(5, 2) DEFAULT NULL COMMENT '密实度:当soilname=2(粉土)、3(砂土)、4(粗粒土)时必填,其他情况可为空',
  jp VARCHAR(512) DEFAULT NULL COMMENT '级配:当soilname=3(砂土)、4(粗粒土)时必填,其他情况可为空',
  md DECIMAL(5, 2) DEFAULT NULL COMMENT '密度:单位g/cm³,物理力学指标,不可为空',
  hsl DECIMAL(5, 2) DEFAULT NULL COMMENT '含水量:单位%,不可为空',
  ysml DECIMAL(5, 2) DEFAULT NULL COMMENT '压缩模量:单位MPa,可为空',
  zbbs DECIMAL(5, 2) DEFAULT NULL COMMENT '纵波波速:单位km/s,填写0时默认空,可为空',
  -- 掌子面数据
  basicwylevel DECIMAL(1, 0) DEFAULT NULL COMMENT '围岩基本分级:I-VI',
  shenshuiliang DECIMAL(3, 0) DEFAULT NULL COMMENT '渗水量:L/(min·10m)',
  dxspd DECIMAL(1, 0) DEFAULT NULL COMMENT '地下水评定:(1:潮湿;2:淋雨;3:涌流)',
  ms DECIMAL(6, 2) DEFAULT NULL COMMENT '埋深H(m)',
  pgjz DECIMAL(3, 0) DEFAULT NULL COMMENT '评估基准:Rc/σmax',
  dzgzyl VARCHAR(512) DEFAULT NULL COMMENT '地质构造应力状态:文字描述',
  csdylqt VARCHAR(512) DEFAULT NULL COMMENT '初始地应力状态其他描述',
  csdylpd VARCHAR(512) DEFAULT NULL COMMENT '初始地应力评定:(1:一般;2:高;3:极高)',
  fixwylevel DECIMAL(1, 0) DEFAULT NULL COMMENT '修正后围岩级别:1-6',
  zzmms VARCHAR(1024) DEFAULT NULL COMMENT '掌子面简要描述',
  -- 附件及成果图
  zzmsmpic VARCHAR(32) DEFAULT NULL COMMENT '掌子面素描流水号:file_uploads.serialno',
  images VARCHAR(1024) DEFAULT NULL COMMENT '作业现场图流水号序列:serialno#serialno...',
  addition VARCHAR(1024) DEFAULT NULL COMMENT '附件流水号序列:serialno#serialno...',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (zzmsm_pk),
  UNIQUE KEY uk_zzmsm_id (zzmsm_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '掌子面素描数据表';

-- =========================
-- 洞身素描
-- =========================
CREATE TABLE t_dssm (
  dssm_pk BIGINT AUTO_INCREMENT COMMENT '洞身素描主键',
  dssm_id BIGINT DEFAULT NULL COMMENT '洞身素描ID',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '掌子面里程',
  site_pk BIGINT COMMENT '工点主键',
  monitordate DATETIME DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  dssm_length DECIMAL(10, 2) DEFAULT NULL COMMENT '开挖循环长度(m)',
  yb_pk BIGINT COMMENT '预报分段信息主键',
  beginkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '开始里程值(m)',
  sjwydj DECIMAL(1, 0) DEFAULT NULL COMMENT '设计围岩等级(1-6)',
  sgwydj DECIMAL(1, 0) DEFAULT NULL COMMENT '施工围岩等级(1-6)',
  -- 其他信息
  sjdzms VARCHAR(1024) DEFAULT NULL COMMENT '设计工程地质、水文地质描述',
  sgdztz VARCHAR(1024) DEFAULT NULL COMMENT '地层岩性特征',
  sggztz VARCHAR(1024) DEFAULT NULL COMMENT '构造特征',
  shswtz VARCHAR(1024) DEFAULT NULL COMMENT '水文地质特征',
  -- 附件及成果图
  zbqsmt VARCHAR(255) DEFAULT NULL COMMENT '左边墙素描图流水号:serialno',
  zbqxct VARCHAR(255) DEFAULT NULL COMMENT '左边墙现场照片流水号:serialno',
  gbsmt VARCHAR(255) DEFAULT NULL COMMENT '拱部素描图流水号',
  gbxct VARCHAR(255) DEFAULT NULL COMMENT '拱部现场照片流水号',
  ybqsmt VARCHAR(255) DEFAULT NULL COMMENT '右边墙素描图流水号',
  ybqxct VARCHAR(255) DEFAULT NULL COMMENT '右边墙现场照片流水号',
  addition VARCHAR(1024) DEFAULT NULL COMMENT '附件流水号序列',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (dssm_pk),
  UNIQUE KEY uk_dssm_id (dssm_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '洞身素描数据表';

-- =========================
-- 钻探法
-- =========================
CREATE TABLE t_ztf (
  ztf_pk BIGINT AUTO_INCREMENT COMMENT '钻探法主键',
  ztf_id BIGINT DEFAULT NULL COMMENT '钻探法记录ID',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '掌子面里程',
  site_pk BIGINT COMMENT '工点主键',
  monitordate DATETIME DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  ztf_length DECIMAL(10, 2) DEFAULT NULL COMMENT '预报长度',
  yb_pk BIGINT COMMENT '预报分段信息主键',
  kwtype DECIMAL(1, 0) DEFAULT NULL COMMENT '钻孔类型:1超前水平钻;2加深炮孔',
  images VARCHAR(255) DEFAULT NULL COMMENT '作业现场图',
  addition VARCHAR(1024) DEFAULT NULL COMMENT '附件流水号',
  PRIMARY KEY (ztf_pk),
  UNIQUE KEY uk_ztf_id (ztf_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '钻探法';

-- =========================
-- 钻探法-超前水平钻-钻孔柱状图(原孔位信息表)
-- =========================
CREATE TABLE t_ztf_zkzz (
  ztf_zkzz_pk BIGINT AUTO_INCREMENT COMMENT '钻孔柱状图主键',
  ztf_zkzz_id BIGINT DEFAULT NULL COMMENT '钻孔柱状图ID',
  ztf_pk BIGINT COMMENT '钻探法主键',
  kwbh VARCHAR(10) DEFAULT NULL COMMENT '孔位编号:序号由1开始递增,不超过10位',
  jgdjl DECIMAL(3, 1) DEFAULT NULL COMMENT '距拱顶距离:单位m,保留1位小数,整数位≤2位',
  jzxxjl DECIMAL(3, 1) DEFAULT NULL COMMENT '距中心线距离:单位m,保留1位小数,整数位≤2位',
  kwljangle DECIMAL(4, 1) DEFAULT NULL COMMENT '开孔立角角度:单位°,保留1位小数,整数位≤3位',
  kwpjangle DECIMAL(4, 1) DEFAULT NULL COMMENT '开孔偏角角度:单位°,保留1位小数,整数位≤3位',
  zkzj DECIMAL(5, 0) DEFAULT NULL COMMENT '钻孔直径:单位mm,不超过4位整数',
  zjcode VARCHAR(30) DEFAULT NULL COMMENT '钻机型号:使用钻机的型号,不超过30位',
  kssj DATETIME DEFAULT NULL COMMENT '开始时间:格式YYYY-MM-DD HH24:MI:SS',
  jssj DATETIME DEFAULT NULL COMMENT '结束时间:格式YYYY-MM-DD HH24:MI:SS',
  kkwzsyt VARCHAR(50) DEFAULT NULL COMMENT '孔口位置示意图:上传产生的流水号,不超过50位',
  sfqx DECIMAL(1, 0) DEFAULT NULL COMMENT '是否取芯:1取芯;0不取芯',
  qxpic VARCHAR(255) NULL COMMENT '取芯照片',
  remark VARCHAR(1024) NULL COMMENT '备注:选填,文字描述',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (ztf_zkzz_pk),
  UNIQUE KEY uk_ztf_zkzz_id (ztf_zkzz_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '超前水平钻孔位信息-基本信息';

-- =========================
-- 钻探法-超前水平钻-钻孔柱状图(原孔位信息表)-钻探记录表
-- =========================
CREATE TABLE t_ztf_ztjlb (
  ztf_ztjlb_pk BIGINT AUTO_INCREMENT COMMENT '钻探记录主键',
  ztf_ztjlb_id BIGINT DEFAULT NULL COMMENT '钻探记录ID',
  ztf_zkzz_pk BIGINT COMMENT '钻孔柱状图主键',
  kssj DATETIME DEFAULT NULL COMMENT '开始时间:格式YYYY-MM-DD HH24:MI:SS',
  jssj DATETIME DEFAULT NULL COMMENT '结束时间:格式YYYY-MM-DD HH24:MI:SS',
  zksd DECIMAL(4, 2) DEFAULT NULL COMMENT '钻孔深度:单位m,保留2位小数,整数位≤2位',
  zkpressure DECIMAL(7, 2) DEFAULT NULL COMMENT '钻孔压力:单位mPa,保留2位小数,整数位≤5位',
  zkspeed DECIMAL(7, 2) DEFAULT NULL COMMENT '钻速:范围值,单位转/分,保留2位小数,以-分割(如55.5-55.8)',
  kwwaterpre DECIMAL(7, 2) DEFAULT NULL COMMENT '孔内水压:单位mPa,保留2位小数,整数位≤5位',
  kwwaterspe DECIMAL(7, 2) DEFAULT NULL COMMENT '孔内水量:单位m³/h,保留2位小数,整数位≤5位',
  dzms VARCHAR(1024) DEFAULT NULL COMMENT '钻进特征及地质情况简述:文字描述',
  kwzbxl VARCHAR(20) DEFAULT NULL COMMENT '孔位坐标序列:像素坐标,格式X#Y,不超过20位',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (ztf_ztjlb_pk),
  UNIQUE KEY uk_ztf_ztjlb_id (ztf_ztjlb_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '钻探记录表';

-- =========================
-- 钻探法-超前水平钻-钻孔柱状图(原孔位信息表)-地层信息
-- =========================
CREATE TABLE t_ztf_dcxx (
  ztf_dcxx_pk BIGINT AUTO_INCREMENT COMMENT '地层信息主键',
  ztf_dcxx_id BIGINT DEFAULT NULL COMMENT '地层信息ID',
  ztf_zkzz_pk BIGINT COMMENT '钻孔柱状图主键',
  dcdh DECIMAL(3, 0) DEFAULT NULL COMMENT '地层代号',
  dclc DECIMAL(10, 2) DEFAULT NULL COMMENT '层底里程:单位m,保留2位小数(如DK215+763.32传215763.32)',
  fchd DECIMAL(4, 2) DEFAULT NULL COMMENT '分层厚度:单位m,保留2位小数,整数位≤2位',
  cslcz DECIMAL(10, 2) DEFAULT NULL COMMENT '出水位置:单位m,保留2位小数,无出水传0',
  csl DECIMAL(7, 2) DEFAULT NULL COMMENT '出水量:单位m³/h,保留2位小数,整数位≤5位',
  cywz VARCHAR(20) NULL COMMENT '采样位置:选填,采样点描述',
  gcdzjj VARCHAR(512) DEFAULT NULL COMMENT '工程地质简述:灰岩;泥土;其他(字典不全需沟通)',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (ztf_dcxx_pk),
  UNIQUE KEY uk_ztf_dcxx_id (ztf_dcxx_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '地层信息表';

-- =========================
-- 钻探法-加深炮孔表
-- =========================
CREATE TABLE t_ztf_jspk (
  ztf_jspk_pk BIGINT (20) AUTO_INCREMENT COMMENT '加深炮孔主键',
  ztf_jspk_id BIGINT (20) DEFAULT NULL COMMENT '加深炮孔ID',
  ztf_pk BIGINT COMMENT '钻探法主键',
  zkwz VARCHAR(20) DEFAULT NULL COMMENT '钻孔位置:钻孔所在位置信息',
  wcj DECIMAL(4, 1) DEFAULT NULL COMMENT '外插角:单位℃,保留1位小数,整数位不得超过3位',
  zkcd DECIMAL(4, 2) DEFAULT NULL COMMENT '钻孔长度:单位m,保留2位小数,整数位不得超过2位',
  dzqkjs VARCHAR(512) DEFAULT NULL COMMENT '钻进特征及地质情况简述:文字描述钻进特征和地质情况',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (ztf_jspk_pk),
  UNIQUE KEY uk_ztf_jspk_id (ztf_jspk_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '加深炮孔表';

-- =========================
-- 地表补充
-- =========================
CREATE TABLE t_dbbc (
  dbbc_pk BIGINT (20) AUTO_INCREMENT COMMENT '地表补充主键',
  dbbc_id BIGINT (20) DEFAULT NULL COMMENT '地表补充ID',
  dkname VARCHAR(5) DEFAULT NULL COMMENT '里程冠号',
  dkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '掌子面里程',
  site_pk BIGINT COMMENT '工点主键',
  monitordate DATETIME DEFAULT NULL COMMENT '预报日期:格式:YYYY-MM-DD HH24:MI:SS',
  yb_pk BIGINT COMMENT '预报分段信息主键',
  beginkilo DECIMAL(10, 2) DEFAULT NULL COMMENT '开始里程值',
  dbbc_length DECIMAL(10, 2) DEFAULT NULL COMMENT '本次预报长度',
  sjwydj DECIMAL(1, 0) DEFAULT NULL COMMENT '设计围岩等级(1-6)',
  -- 地表信息
  dcyx VARCHAR(512) DEFAULT NULL COMMENT '地层岩性描述',
  dbry VARCHAR(512) DEFAULT NULL COMMENT '地表岩溶描述',
  tsdz VARCHAR(512) DEFAULT NULL COMMENT '特殊地质产状描述',
  rwdk VARCHAR(512) DEFAULT NULL COMMENT '人为坑道描述',
  remark TEXT DEFAULT NULL COMMENT '备注',
  sjqk DECIMAL(1, 0) DEFAULT NULL COMMENT '设计情况是否相符:1相符;2基本相符;3不符',
  dzpj VARCHAR(512) DEFAULT NULL COMMENT '地质评定',
  addition VARCHAR(1024) DEFAULT NULL COMMENT '附件流水号序列',
  gmt_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间:记录数据首次插入的格林威治标准时间',
  gmt_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间:记录数据最后修改的格林威治标准时间',
  PRIMARY KEY (dbbc_pk),
  UNIQUE KEY uk_dbbc_id (dbbc_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '地表补充表';