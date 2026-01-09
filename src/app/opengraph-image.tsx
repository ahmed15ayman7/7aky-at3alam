import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "حقي أتعلم - نظام إدارة العلاج الطبي";
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
          background: "linear-gradient(135deg, #EAB308 0%, #3B82F6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Arial",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: "bold",
            marginBottom: 30,
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          حقي أتعلم
        </div>
        <div style={{ fontSize: 50, textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
          نظام إدارة العلاج الطبي
        </div>
        <div
          style={{
            fontSize: 35,
            marginTop: 30,
            opacity: 0.9,
          }}
        >
          منصة متكاملة لإدارة علاج الأطفال في مراكز التخاطب
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

