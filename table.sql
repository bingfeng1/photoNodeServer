CREATE TABLE `users` (
  `account` VARCHAR(50) NOT NULL COMMENT '账号名称',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `pass` VARCHAR(200) DEFAULT NULL COMMENT '密码',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `sex` TINYINT(4) DEFAULT NULL COMMENT '性别',
  `hobbies` VARCHAR(50) DEFAULT NULL COMMENT '喜好（用,隔开）',
  `imageBase64` MEDIUMBLOB COMMENT '头像',
  `imageType` VARCHAR(20) DEFAULT NULL COMMENT '图片信息',
  PRIMARY KEY (`account`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT='用户信息表';

CREATE TABLE `userImgType` (
  `account` VARCHAR(50) COLLATE utf8_estonian_ci NOT NULL COMMENT '用户账户',
  `typename` VARCHAR(20) COLLATE utf8_estonian_ci NOT NULL COMMENT '分类名称',
  `orderId` INT(10) DEFAULT NULL COMMENT '分类排序',
  PRIMARY KEY (`account`,`typename`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci COMMENT='用户自定义图片分组';