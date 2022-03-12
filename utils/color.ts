import Color from "color";

export const generateBGHex = (color?: string, alpha: number = 0.2) => {
  if (!color)
    return {
      background: undefined,
      text: undefined,
      placeholder: undefined,
      disabled: undefined,
    };
  const c = Color(color);
  if (c.isLight()) {
    const returnedColor = c.mix(Color("black"), alpha).hex();
    const textColor =
      Color(returnedColor).contrast(Color("#fff")) >= 1.5 ? "#fff" : "#000";

    return {
      text: textColor,
      placeholder:
        textColor === "#fff"
          ? Color(textColor).mix(Color("black"), 0.15).hex()
          : Color(textColor).mix(Color("white"), 0.15).hex(),
      background: returnedColor,
      disabled:
        textColor === "#fff"
          ? Color(textColor).mix(Color("black"), 0.25).hex()
          : Color(textColor).mix(Color("white"), 0.25).hex(),
    };
  } else {
    const returnedColor = c.mix(Color("white"), alpha).hex();
    const textColor =
      Color(returnedColor).contrast(Color("#fff")) >= 1.5 ? "#fff" : "#000";

    return {
      text: textColor,
      placeholder:
        textColor === "#fff"
          ? Color(textColor).mix(Color("black"), 0.15).hex()
          : Color(textColor).mix(Color("white"), 0.15).hex(),
      background: returnedColor,
      disabled:
        textColor === "#fff"
          ? Color(textColor).mix(Color("black"), 0.25).hex()
          : Color(textColor).mix(Color("white"), 0.25).hex(),
    };
  }
};
