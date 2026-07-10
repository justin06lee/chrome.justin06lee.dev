/**
 * Strip ANSI escape sequences and C0 control chars (except \n and \t) from
 * remote-sourced strings before printing, so a hostile registry can't inject
 * terminal escapes into the user's shell.
 */
export function sanitize(s: string): string {
  return s
    // CSI sequences: ESC [ params intermediates final-byte
    .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "")
    // OSC sequences: ESC ] ... (BEL or ESC \)
    .replace(/\x1b\][^\x07\x1b]*(\x07|\x1b\\)?/g, "")
    // any remaining ESC + one char
    .replace(/\x1b[@-_]?/g, "")
    // remaining C0 controls + DEL, keeping \t (0x09) and \n (0x0a)
    .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, "");
}
