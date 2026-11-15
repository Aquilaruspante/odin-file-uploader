/*
  Warnings:

  - You are about to drop the column `asset_id` on the `File` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_asset_id_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "asset_id";
