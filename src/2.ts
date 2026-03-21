function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

delay(500).then(() => console.log("Готово через 500мс"));