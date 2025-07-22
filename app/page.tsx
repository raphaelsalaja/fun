"use client";

import * as Converter from "@/components/converter";

import "@/styles/main.css";

export default function Page() {
  return (
    <Converter.ConverterProvider>
      <ConverterContent />
    </Converter.ConverterProvider>
  );
}

function ConverterContent() {
  const { sourceAmount, targetAmount, usdAmount, setSourceAmount, swapTokens } =
    Converter.useConverter();

  return (
    <Converter.Root>
      <Converter.Section>
        <Converter.Currency />
        <Converter.Field
          value={sourceAmount || ""}
          onChange={(e) => setSourceAmount(Number(e.target.value) || 0)}
        />
        <Converter.Currency />
      </Converter.Section>
      <Converter.Stack>
        <Converter.Section variant="secondary">
          <Converter.Value value={usdAmount} />
          <Converter.SourceToken />
        </Converter.Section>
        <Converter.Section variant="secondary">
          <Converter.Value value={targetAmount} />
          <Converter.TargetToken />
        </Converter.Section>
        <Converter.Swap />
      </Converter.Stack>
    </Converter.Root>
  );
}
