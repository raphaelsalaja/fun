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
  return (
    <Converter.Root>
      <Converter.Section>
        <Converter.Field />
      </Converter.Section>
      <Converter.Stack>
        <Converter.Section variant="secondary">
          <Converter.SourceValue />
          <Converter.SourceToken />
        </Converter.Section>
        <Converter.Section variant="secondary">
          <Converter.TargetValue />
          <Converter.TargetToken />
        </Converter.Section>
        <Converter.Swap />
      </Converter.Stack>
    </Converter.Root>
  );
}
