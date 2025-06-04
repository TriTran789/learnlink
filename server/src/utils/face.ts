import { Image } from "canvas";
import * as faceapi from "face-api.js";

// Hàm detect và extract face descriptor
export async function getFaceDescriptor(image: Image) {
  const detection = await faceapi
    .detectSingleFace(image as any)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error("No face detected in the image");
  }

  return detection.descriptor;
}
