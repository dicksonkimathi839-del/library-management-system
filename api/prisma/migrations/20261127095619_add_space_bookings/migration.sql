-- CreateTable
CREATE TABLE "SpaceBooking" (
    "id" SERIAL NOT NULL,
    "space" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpaceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpaceBooking_space_date_idx" ON "SpaceBooking"("space", "date");

-- CreateIndex
CREATE INDEX "SpaceBooking_userId_idx" ON "SpaceBooking"("userId");

-- AddForeignKey
ALTER TABLE "SpaceBooking" ADD CONSTRAINT "SpaceBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
