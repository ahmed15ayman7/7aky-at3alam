import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "قائمة الأطفال - حقي أتعلم";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(to bottom, #EAB308, #CA8A04)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: "bold", marginBottom: 20 }}>
          حقي أتعلم
        </div>
        <div style={{ fontSize: 50 }}>إدارة الأطفال</div>
      </div>
    ),
    {
      ...size,
    }
  );
}

