describe("performance", () => {
  it("should generate elements and calculate total amount", () => {
    const start = performance.now();
    const elements: any[] = [];
    for (let i = 0; i < 1000000; i++) {
      elements.push({
        id: new Date().getTime(),
        amount: Math.floor(Math.random() * 101001) - 1000,
        date: new Date(),
        name: `name-${i}`,
        randomShit: Math.random(),
      });
    }

    const totalAmount = elements.reduce((acc, curr) => acc + curr.amount, 0);
    console.log({ totalAmount });

    const end = performance.now();
    const executionTime = end - start;
    console.log(`Execution time: ${executionTime} milliseconds`);

    expect(executionTime).toBeLessThan(2000);
  });
  it("should calculate total duration for 10,000 random date pairs in less than 2 seconds", () => {
    const start = performance.now();

    const elements = Array.from({ length: 1000000 }, () => {
      const startDate = new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
      );
      const endDate = new Date(
        startDate.getTime() +
          Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      );
      return { startingTime: startDate, endingTime: endDate };
    });

    const totalDuration = elements.reduce(
      (acc, { startingTime, endingTime }) => {
        return acc + (endingTime.getTime() - startingTime.getTime());
      },
      0
    );

    console.log(`Total duration: ${totalDuration} milliseconds`);

    const end = performance.now();
    const executionTime = end - start;
    console.log(`Execution time: ${executionTime} milliseconds`);

    expect(executionTime).toBeLessThan(2000);
  });
});
