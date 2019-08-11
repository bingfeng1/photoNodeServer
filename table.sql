CREATE TABLE `users` (
    `account` varchar(50) NOT NULL COMMENT '账号名称', 
    `nickname` varchar(50) DEFAULT NULL COMMENT '昵称', 
    `pass` varchar(200) DEFAULT NULL COMMENT '密码',
    `birthday` date DEFAULT NULL COMMENT '生日', 
    `sex` tinyint(4) DEFAULT NULL COMMENT '性别', 
    `hobbies` varchar(50) DEFAULT NULL COMMENT '喜好（用,隔开）', 
    `imageBase64` blob COMMENT '头像', 
    `imgtype` varchar(20) DEFAULT NULL, 
    PRIMARY KEY (`account`) 
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8