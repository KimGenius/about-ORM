-- CreateTable
CREATE TABLE `User2` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191),
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User2.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
