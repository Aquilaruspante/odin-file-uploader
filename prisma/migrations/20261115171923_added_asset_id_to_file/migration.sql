/*
  Warnings:

  - A unique constraint covering the columns `[asset_id]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `asset_id` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "asset_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_asset_id_key" ON "File"("asset_id");
