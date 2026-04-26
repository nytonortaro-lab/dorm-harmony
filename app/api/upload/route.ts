import { NextRequest, NextResponse } from "next/server";

// 图片大小限制 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// 允许的图片类型
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image is too large, maximum 5MB allowed" },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid image format. Only JPG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    // 读取文件为 base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          url: dataUrl,
          name: file.name,
          size: file.size,
          type: file.type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
