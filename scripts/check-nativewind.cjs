const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const { cssToReactNativeRuntime } = require("react-native-css-interop/css-to-rn");
const { twMerge } = require("tailwind-merge");

async function main() {
  const config = require("../tailwind.config.js");
  const result = await postcss([tailwind(config)]).process(
    fs.readFileSync(path.join(__dirname, "../global.css"), "utf8"),
    { from: path.join(__dirname, "../global.css") },
  );
  const compiled = cssToReactNativeRuntime(result.css, { inlineRem: 16 });
  const rules = new Map(Object.entries(compiled.rules));
  for (const name of ["bg-background", "bg-primary", "text-text", "border-card-border", "font-nunito-medium", "font-nunito-semibold", "font-nunito-bold", "active:opacity-[0.85]"]) {
    assert(rules.has(name), `Falta la regla nativa ${name}`);
  }
  assert.equal(twMerge("bg-surface border-[1px]", "bg-primary border-[2px]"), "bg-primary border-[2px]");
  assert.equal(twMerge("text-[16px] font-nunito-medium text-text", "text-[18px] font-nunito-bold text-primary"), "text-[18px] font-nunito-bold text-primary");

  let checked = 0;
  function checkDirectory(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { checkDirectory(file); continue; }
      if (!file.endsWith(".tsx")) continue;
      const source = fs.readFileSync(file, "utf8");
      const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      assert.equal(tree.parseDiagnostics.length, 0, `JSX inválido: ${file}`);
      assert(!source.includes("StyleSheet.create("), `Estilos antiguos en ${file}`);
      function checkClasses(expression) {
        if (ts.isStringLiteral(expression)) {
          for (const name of expression.text.split(/\s+/).filter(Boolean)) {
            assert(rules.has(name) || name === "group", `Clase sin regla: ${name} en ${file}`);
          }
        } else if (ts.isParenthesizedExpression(expression)) {
          checkClasses(expression.expression);
        } else if (ts.isConditionalExpression(expression)) {
          checkClasses(expression.whenTrue);
          checkClasses(expression.whenFalse);
        } else if (ts.isCallExpression(expression) && expression.expression.getText(tree) === "cn") {
          expression.arguments.forEach(checkClasses);
        } else if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) {
          checkClasses(expression.right);
        }
      }
      function visit(node) {
        if (ts.isJsxAttribute(node) && node.name.getText(tree) === "style" && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression && ts.isArrowFunction(node.initializer.expression)) {
          const body = node.initializer.expression.body;
          assert(!ts.isBlock(body) || !body.statements.some(ts.isLabeledStatement), `Callback de estilo sin retorno en ${file}`);
        }
        if (ts.isJsxAttribute(node) && /ClassName$|^className$/.test(node.name.getText(tree)) && node.initializer) {
          if (ts.isStringLiteral(node.initializer)) checkClasses(node.initializer);
          else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) checkClasses(node.initializer.expression);
        }
        ts.forEachChild(node, visit);
      }
      visit(tree);
      checked++;
    }
  }
  ["app", "components"].forEach(checkDirectory);
  console.log(`NativeWind: ${checked} archivos JSX y ${rules.size} reglas nativas verificados.`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
