import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import * as fs from "fs";
import * as path from "path";

dayjs.extend(isSameOrBefore);

const START_DATE = "2025-03-01";
const END_DATE = "2025-07-12";
const COLLABORATOR_ID = "61dff1cb4131595911ad13fb";

interface ActivityRegister {
  collaborator: string;
  activity: string;
  desc: string;
  startingTime: string;
  endingTime: string;
}

function generateActivityRegisters(): ActivityRegister[] {
  const registers: ActivityRegister[] = [];
  const startDate = dayjs(START_DATE);
  const endDate = dayjs(END_DATE);

  let currentDate = startDate;

  while (currentDate.isSameOrBefore(endDate)) {
    const isWeekendDay = currentDate.day() === 0 || currentDate.day() === 6; // Sunday = 0, Saturday = 6
    const dateStr = currentDate.format("YYYY-MM-DD");

    let startHour: number;
    let endHour: number;

    if (isWeekendDay) {
      // Weekend: Create 2 registers - 08:00 to 13:00 and 14:00 to 19:00
      const morningStart = 8;
      const morningEnd = 13;
      const afternoonStart = 14;
      const afternoonEnd = 19;

      // Morning register
      const morningStartingTime = `${dateStr}T${morningStart
        .toString()
        .padStart(2, "0")}:00:00.000Z`;
      const morningEndingTime = `${dateStr}T${morningEnd
        .toString()
        .padStart(2, "0")}:00:00.000Z`;

      registers.push({
        collaborator: COLLABORATOR_ID,
        activity: "various",
        desc: "",
        startingTime: morningStartingTime,
        endingTime: morningEndingTime,
      });

      // Afternoon register
      const afternoonStartingTime = `${dateStr}T${afternoonStart
        .toString()
        .padStart(2, "0")}:00:00.000Z`;
      const afternoonEndingTime = `${dateStr}T${afternoonEnd
        .toString()
        .padStart(2, "0")}:00:00.000Z`;

      registers.push({
        collaborator: COLLABORATOR_ID,
        activity: "various",
        desc: "",
        startingTime: afternoonStartingTime,
        endingTime: afternoonEndingTime,
      });
    } else {
      // Weekday: 15:00 to 21:00
      startHour = 15;
      endHour = 21;

      const startingTime = `${dateStr}T${startHour
        .toString()
        .padStart(2, "0")}:00:00.000Z`;
      const endingTime = `${dateStr}T${endHour
        .toString()
        .padStart(2, "0")}:00:00.000Z`;

      registers.push({
        collaborator: COLLABORATOR_ID,
        activity: "various",
        desc: "",
        startingTime,
        endingTime,
      });
    }

    // Move to next day
    currentDate = currentDate.add(1, "day");
  }

  return registers;
}

// Generate the registers
const activityRegisters = generateActivityRegisters();

// Save to JSON file
const outputPath = path.join(__dirname, "activityRegisters.json");
fs.writeFileSync(outputPath, JSON.stringify(activityRegisters, null, 2));

console.log(`Generated ${activityRegisters.length} activity registers`);
console.log(`Output saved to: ${outputPath}`);

// Export for use in other modules
export { generateActivityRegisters, ActivityRegister };
