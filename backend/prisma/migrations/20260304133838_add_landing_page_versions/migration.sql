-- CreateTable
CREATE TABLE "LandingPageVersion" (
    "id" TEXT NOT NULL,
    "landing_page_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "briefing" JSONB,
    "content" JSONB NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandingPageVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandingPageVersion_landing_page_id_created_at_idx" ON "LandingPageVersion"("landing_page_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "LandingPageVersion_landing_page_id_version_number_key" ON "LandingPageVersion"("landing_page_id", "version_number");

-- CreateIndex
CREATE INDEX "LandingPage_user_id_idx" ON "LandingPage"("user_id");

-- AddForeignKey
ALTER TABLE "LandingPageVersion" ADD CONSTRAINT "LandingPageVersion_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "LandingPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
