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
  `id` VARCHAR(50) COLLATE utf8_estonian_ci NOT NULL COMMENT '列表的单独主键',
  `account` VARCHAR(50) COLLATE utf8_estonian_ci NOT NULL COMMENT '用户账户',
  `typename` VARCHAR(20) COLLATE utf8_estonian_ci NOT NULL COMMENT '分类名称',
  `orderId` INT(10) DEFAULT NULL COMMENT '分类排序',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci COMMENT='用户自定义图片分组';


CREATE TABLE `imagelist` (
  `id` VARCHAR(50) COLLATE utf8_estonian_ci NOT NULL COMMENT '图片的唯一id',
  `account` VARCHAR(50) COLLATE utf8_estonian_ci NOT NULL COMMENT '上传人',
  `path` VARCHAR(200) COLLATE utf8_estonian_ci NOT NULL COMMENT '存放图片的完整路径',
  `originalname` VARCHAR(50) COLLATE utf8_estonian_ci NOT NULL COMMENT '上传时的图片信息',
  `relativepath` VARCHAR(200) COLLATE utf8_estonian_ci NOT NULL COMMENT '相对根路径的路径',
  `destination` VARCHAR(200) COLLATE utf8_estonian_ci NOT NULL COMMENT '存放图片的根路径',
  `filename` VARCHAR(50) COLLATE utf8_estonian_ci NOT NULL COMMENT '系统生成的图片名称',
  `createtime` DATETIME NOT NULL COMMENT '存放时间',
  `size` VARCHAR(50) COLLATE utf8_estonian_ci DEFAULT NULL COMMENT '图片大小',
  `ext` VARCHAR(20) COLLATE utf8_estonian_ci NOT NULL COMMENT '后缀名',
  `mimetype` VARCHAR(50) COLLATE utf8_estonian_ci DEFAULT NULL COMMENT '图片格式',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci COMMENT='所有图片存放的路径';

drop table users;
drop table userImgType;
drop table imagelist;
DELETE  FROM `imagelist`
SELECT * FROM `imagelist`

SELECT filename FROM `imagelist` WHERE `account` = '1'