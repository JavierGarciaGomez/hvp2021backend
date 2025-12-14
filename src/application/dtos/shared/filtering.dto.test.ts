import { FilteringDto } from "./filtering.dto";
describe("FilteringDto", () => {
  it("should create a filteringDto", () => {
    const filteringDto = FilteringDto.create({});
  });

  it("should create a filteringDto with range", () => {
    const result = FilteringDto.create({
      $requestedDays:
        "$range:2025-01-01T00:00:00.000Z...2026-06-01T00:00:00.000Z",
      collaborator: "61e9fb0c11d080f125a93ec3",
    });
    expect(result).toEqual({
      requestedDays: {
        $gte: new Date("2025-01-01T00:00:00.000Z"),
        $lte: new Date("2026-06-01T00:00:00.000Z"),
      },
      collaborator: "61e9fb0c11d080f125a93ec3",
    });
  });

  it("should create a filteringDto with $in", () => {
    const result = FilteringDto.create({
      $collaborator: '$in: ["123a", "456a"]',
    });
    expect(result).toEqual({
      collaborator: {
        $in: ["123a", "456a"],
      },
    });
  });

  it("should create a gte and lte for different params", () => {
    const result = FilteringDto.create({
      $periodStartDate: "$gte:2025-01-01T00:00:00.000Z",
      $periodEndDate: "$lte:2026-06-01T00:00:00.000Z",
    });
    expect(result).toEqual({
      periodStartDate: {
        $gte: new Date("2025-01-01T00:00:00.000Z"),
      },
      periodEndDate: {
        $lte: new Date("2026-06-01T00:00:00.000Z"),
      },
    });
  });
});
