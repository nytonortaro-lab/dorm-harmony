import { NextRequest, NextResponse } from "next/server";

// 模拟用户数据库
const users: Record<string, { password: string; email: string; username: string }> = {
  "user1@example.com": {
    password: "password123",
    email: "user1@example.com",
    username: "user1",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "邮箱、用户名和密码不能为空" },
        { status: 400 }
      );
    }

    // 检查邮箱是否已注册
    if (users[email]) {
      return NextResponse.json(
        { message: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { message: "密码长度不能少于 6 位" },
        { status: 400 }
      );
    }

    // 创建新用户
    users[email] = { password, email, username };

    return NextResponse.json(
      {
        message: "注册成功",
        user: {
          id: Math.random().toString(36).substr(2, 9),
          email,
          username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}
