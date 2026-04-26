import { NextRequest, NextResponse } from "next/server";

// 模拟用户数据库 (实际应该使用真实的数据库)
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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const user = users[email];
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    // 返回用户信息
    return NextResponse.json(
      {
        message: "登陆成功",
        user: {
          id: Math.random().toString(36).substr(2, 9),
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}
