/**
 * Hand-drawn underline. Two passes, as if the line were gone over twice.
 *
 * `preserveAspectRatio="none"` lets the squiggle stretch to whatever width the
 * heading happens to be, and `vector-effect="non-scaling-stroke"` stops that
 * stretch from smearing the stroke. `pathLength="100"` normalises both curves to
 * the same length so one `stroke-dasharray` in CSS draws either of them.
 */
const SketchUnderline = () => (
  <svg
    className="sketch-underline"
    viewBox="0 0 200 14"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      className="sketch-underline-pass"
      pathLength="100"
      d="M3 8.5 C 34 4 62 11.5 96 7 S 158 3.5 197 8"
    />
    <path
      className="sketch-underline-pass sketch-underline-pass--second"
      pathLength="100"
      d="M11 11.6 C 48 8.6 92 13 151 10.2"
    />
  </svg>
);

export default SketchUnderline;
