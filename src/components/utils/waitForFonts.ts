export async function waitForFonts() {
  if (!("fonts" in document)) {
    return;
  }

  try {
    await document.fonts.ready;
  } catch {
    return;
  }
}