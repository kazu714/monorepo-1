/*
  Warnings:

  - You are about to drop the column `csrfSecret` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `revokedAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Session_revokedAt_idx` ON `session`;

-- AlterTable
ALTER TABLE `session` DROP COLUMN `csrfSecret`,
    DROP COLUMN `ip`,
    DROP COLUMN `revokedAt`,
    DROP COLUMN `userAgent`;
