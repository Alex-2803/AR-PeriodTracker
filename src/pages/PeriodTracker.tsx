import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToast,
  IonBadge,
  IonModal,
  IonContent,
  IonChip,
  IonAlert,
} from "@ionic/react";
import {
  arrowBack,
  calendar,
  heart,
  informationCircleOutline,
  saveOutline,
  calendarOutline,
  trashOutline,
  chevronBack,
  chevronForward,
  chevronDown,
  chevronUp,
  eyeOutline,
  listOutline,
  analyticsOutline,
  warningOutline,
  checkmarkCircleOutline,
  calendarClearOutline,
} from "ionicons/icons";
import { useState, useEffect } from "react";
import { AppLayout } from "../components/shared";
import { usePersistedState } from "../components/hooks/usePersistedState";

const PeriodTracker: React.FC = () => {
  const [segment, setSegment] = useState<"overview" | "calendar" | "stats">(
    "overview",
  );
  // const [periodStartDates, setPeriodStartDates] = useState<string[]>([]);
  const [periodStartDates, setPeriodStartDates] = usePersistedState<string[]>(
    "periodStartDates",
    [],
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  // const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = usePersistedState<string[]>(
    "selectedDays",
    [],
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAllRecentLogged, setShowAllRecentLogged] = useState(false);
  const [showClearAlert, setShowClearAlert] = useState(false);

  // Store all period days (not just start dates)
  const [allPeriodDays, setAllPeriodDays] = usePersistedState<string[]>(
    "allPeriodDays",
    [],
  );

  // For month/year picker
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  // Cycle phase constants
  const CYCLE_PHASES = {
    MENSTRUAL: { name: "Menstrual", color: "#FF6B8B" },
    FOLLICULAR: { name: "Follicular", color: "#4ECDC4" },
    OVULATION: { name: "Ovulation", color: "#FFD166" },
    LUTEAL: { name: "Luteal", color: "#06D6A0" },
  };

  // Show disclaimer on first visit

  // Helper function to get date in YYYY-MM-DD format, handling timezone correctly
  const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to create date from string, handling timezone
  const parseDateString = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  };

  // Helper to get today's date at midnight in local timezone
  const getToday = (): Date => {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    try {
      const savedDates = localStorage.getItem("periodStartDates");
      if (savedDates) {
        setPeriodStartDates(JSON.parse(savedDates));
      }

      const savedSelectedDays = localStorage.getItem("selectedDays");
      if (savedSelectedDays) {
        setSelectedDays(JSON.parse(savedSelectedDays));
      }

      const savedAllPeriodDays = localStorage.getItem("allPeriodDays");
      if (savedAllPeriodDays) {
        setAllPeriodDays(JSON.parse(savedAllPeriodDays));
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  // Save period dates to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "periodStartDates",
        JSON.stringify(periodStartDates),
      );
    } catch (error) {
      console.error("Error saving period dates:", error);
    }
  }, [periodStartDates]);

  // Save selected days to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("selectedDays", JSON.stringify(selectedDays));
    } catch (error) {
      console.error("Error saving selected days:", error);
    }
  }, [selectedDays]);

  // Save all period days to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("allPeriodDays", JSON.stringify(allPeriodDays));
    } catch (error) {
      console.error("Error saving all period days:", error);
    }
  }, [allPeriodDays]);

  // Calculate average cycle length - FIXED: Only calculates when we have 2+ period starts
  const getAverageCycleLength = () => {
    if (periodStartDates.length < 2) return 28;

    try {
      const dates = periodStartDates.map((date) =>
        parseDateString(date).getTime(),
      );
      let totalDiff = 0;
      let validCount = 0;

      for (let i = 1; i < dates.length; i++) {
        const diffDays = Math.ceil(
          (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24),
        );
        if (diffDays > 0 && diffDays < 100) {
          // Sanity check
          totalDiff += diffDays;
          validCount++;
        }
      }

      if (validCount === 0) return 28;

      return Math.round(totalDiff / validCount);
    } catch (error) {
      console.error("Error calculating average cycle length:", error);
      return 28;
    }
  };

  // Calculate current cycle day based on last logged period - FIXED: No artificial capping
  const getCurrentCycleDay = () => {
    if (periodStartDates.length === 0) return 1;

    try {
      const lastPeriod = parseDateString(
        periodStartDates[periodStartDates.length - 1],
      );
      const today = getToday();

      const diffTime = today.getTime() - lastPeriod.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      return Math.max(1, diffDays);
    } catch (error) {
      console.error("Error calculating current cycle day:", error);
      return 1;
    }
  };

  const currentDay = getCurrentCycleDay();

  // Calculate current cycle phase - FIXED: Uses accurate biological proportions
  const getCurrentCyclePhase = () => {
    const cycleDay = currentDay;
    const avgCycleLength = getAverageCycleLength();

    // Use biologically accurate phase lengths
    // Menstrual: ~5 days, Ovulation: ~3 days (13-15), Luteal: ~14 days (fixed)

    if (cycleDay <= 5) {
      return {
        ...CYCLE_PHASES.MENSTRUAL,
        actualName: "Menstrual",
        days: [1, 5],
      };
    } else if (cycleDay <= 12) {
      return {
        ...CYCLE_PHASES.FOLLICULAR,
        actualName: "Follicular",
        days: [6, 12],
      };
    } else if (cycleDay <= 15) {
      return {
        ...CYCLE_PHASES.OVULATION,
        actualName: "Ovulation",
        days: [13, 15],
      };
    } else {
      return {
        ...CYCLE_PHASES.LUTEAL,
        actualName: "Luteal",
        days: [16, avgCycleLength],
      };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = parseDateString(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Format date for compact display
  const formatCompactDate = (dateString: string) => {
    try {
      const date = parseDateString(dateString);
      const today = getToday();
      const diffTime = today.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting compact date:", error);
      return "Recent";
    }
  };

  // Get actual days since last period
  const getActualDaysSinceLastPeriod = () => {
    if (periodStartDates.length === 0) return 0;
    try {
      const lastPeriod = parseDateString(
        periodStartDates[periodStartDates.length - 1],
      );
      const today = getToday();
      const diffTime = today.getTime() - lastPeriod.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error("Error calculating days since last period:", error);
      return 0;
    }
  };

  // Calculate cycle irregularities - FIXED: Only checks with 2+ actual cycles
  const getIrregularCycles = () => {
    if (periodStartDates.length < 3) return { count: 0, cycles: [] };

    try {
      const irregularities = [];
      const dates = periodStartDates.map((date) =>
        parseDateString(date).getTime(),
      );

      for (let i = 1; i < dates.length; i++) {
        const diffDays = Math.ceil(
          (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24),
        );
        if (diffDays < 21 || diffDays > 35) {
          irregularities.push({
            startDate: periodStartDates[i - 1],
            endDate: periodStartDates[i],
            length: diffDays,
            type: diffDays < 21 ? "short" : "long",
          });
        }
      }

      return { count: irregularities.length, cycles: irregularities };
    } catch (error) {
      console.error("Error calculating irregular cycles:", error);
      return { count: 0, cycles: [] };
    }
  };

  // Predict next period date - FIXED: Only predicts with 1+ period
  const predictNextPeriod = () => {
    if (periodStartDates.length < 1) return null;

    try {
      const lastPeriod = parseDateString(
        periodStartDates[periodStartDates.length - 1],
      );
      const avgCycleLength = getAverageCycleLength();

      const nextPeriod = new Date(lastPeriod);
      nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength);

      return getFormattedDate(nextPeriod);
    } catch (error) {
      console.error("Error predicting next period:", error);
      return null;
    }
  };

  // Predict ovulation date - FIXED: Uses biologically accurate calculation
  const predictOvulation = () => {
    try {
      const nextPeriodDate = predictNextPeriod();
      if (!nextPeriodDate) return null;

      const nextPeriod = parseDateString(nextPeriodDate);
      const ovulationDate = new Date(nextPeriod);
      ovulationDate.setDate(ovulationDate.getDate() - 14); // Ovulation typically 14 days before next period

      return getFormattedDate(ovulationDate);
    } catch (error) {
      console.error("Error predicting ovulation:", error);
      return null;
    }
  };

  // Clear all data
  const clearAllData = () => {
    try {
      setPeriodStartDates([]);
      setSelectedDays([]);
      setAllPeriodDays([]);
      localStorage.removeItem("periodTrackerDisclaimerShown");
      localStorage.removeItem("periodStartDates");
      localStorage.removeItem("selectedDays");
      localStorage.removeItem("allPeriodDays");
      setToastMessage("All data cleared");
      setShowToast(true);
    } catch (error) {
      console.error("Error clearing data:", error);
      setToastMessage("Error clearing data");
      setShowToast(true);
    }
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  // Format month-year display
  const getMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Check if a date is selected (while selecting)
  const isDateSelected = (date: string) => {
    return selectedDays.includes(date);
  };

  // Check if a date is a saved period day (all days, not just start)
  const isPeriodDate = (date: string) => {
    return allPeriodDays.includes(date);
  };

  // Check if a date is a period start date
  const isPeriodStartDate = (date: string) => {
    return periodStartDates.includes(date);
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    try {
      const selectedDate = parseDateString(date);
      const today = getToday();

      if (selectedDate > today) {
        setToastMessage("Cannot select future dates");
        setShowToast(true);
        return;
      }

      if (isDateSelected(date)) {
        const newSelectedDays = selectedDays.filter((d) => d !== date);
        setSelectedDays(newSelectedDays);
        return;
      }

      if (isPeriodDate(date)) {
        setToastMessage("This day is already logged as a period day");
        setShowToast(true);
        return;
      }

      if (selectedDays.length === 0) {
        setSelectedDays([date]);
        return;
      }

      const sortedSelected = [...selectedDays].sort(
        (a, b) => parseDateString(a).getTime() - parseDateString(b).getTime(),
      );

      const newDate = parseDateString(date).getTime();
      const firstDate = parseDateString(sortedSelected[0]).getTime();
      const lastDate = parseDateString(
        sortedSelected[sortedSelected.length - 1],
      ).getTime();

      if (sortedSelected.length >= 7) {
        setToastMessage("Maximum 7 consecutive days allowed");
        setShowToast(true);
        return;
      }

      const oneDay = 24 * 60 * 60 * 1000;

      if (newDate === firstDate - oneDay) {
        setSelectedDays([date, ...sortedSelected]);
        return;
      }

      if (newDate === lastDate + oneDay) {
        setSelectedDays([...sortedSelected, date]);
        return;
      }

      setToastMessage(
        "Please select consecutive days. Starting new selection.",
      );
      setShowToast(true);
      setSelectedDays([date]);
    } catch (error) {
      console.error("Error selecting date:", error);
      setToastMessage("Error selecting date");
      setShowToast(true);
    }
  };

  // Save selected period days - Save ALL selected days to allPeriodDays
  const savePeriodDays = () => {
    if (selectedDays.length === 0) {
      setToastMessage("Please select at least one day");
      setShowToast(true);
      return;
    }

    try {
      // Sort selected days to get the first day
      const sortedDays = [...selectedDays].sort(
        (a, b) => parseDateString(a).getTime() - parseDateString(b).getTime(),
      );

      // Store the FIRST day as the period start date
      const periodStartDate = sortedDays[0];

      // Check if this period is already logged (compare with first day only)
      const isAlreadyLogged = periodStartDates.includes(periodStartDate);

      if (isAlreadyLogged) {
        setToastMessage("This period start date is already logged");
        setShowToast(true);
        return;
      }

      // Add only the first day to period start dates
      const updatedPeriodStartDates = [
        ...periodStartDates,
        periodStartDate,
      ].sort(
        (a, b) => parseDateString(a).getTime() - parseDateString(b).getTime(),
      );

      // Add ALL selected days to allPeriodDays
      const updatedAllPeriodDays = [...allPeriodDays, ...sortedDays].sort(
        (a, b) => parseDateString(a).getTime() - parseDateString(b).getTime(),
      );

      setPeriodStartDates(updatedPeriodStartDates);
      setAllPeriodDays(updatedAllPeriodDays);
      setSelectedDays([]);

      localStorage.setItem(
        "periodStartDates",
        JSON.stringify(updatedPeriodStartDates),
      );
      localStorage.setItem(
        "allPeriodDays",
        JSON.stringify(updatedAllPeriodDays),
      );
      localStorage.setItem("selectedDays", JSON.stringify([]));

      const periodLength = sortedDays.length;
      setToastMessage(
        `Period logged: ${formatDate(periodStartDate)} (${periodLength} day${periodLength > 1 ? "s" : ""})`,
      );
      setShowToast(true);
    } catch (error) {
      console.error("Error saving period days:", error);
      setToastMessage("Error saving period");
      setShowToast(true);
    }
  };

  // Remove a specific period - removes all days from that period
  const removePeriod = (periodStartDate: string) => {
    try {
      // Find all days from this period
      const periodStart = parseDateString(periodStartDate);

      // Find the next period start to determine length
      const periodIndex = periodStartDates.indexOf(periodStartDate);
      let periodLength = 1; // Default to 1 day if we can't determine

      if (periodIndex < periodStartDates.length - 1) {
        const nextPeriodStart = parseDateString(
          periodStartDates[periodIndex + 1],
        );
        // Estimate period length based on cycle day of next period start
        const diffDays = Math.ceil(
          (nextPeriodStart.getTime() - periodStart.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        periodLength = Math.min(diffDays - 1, 7); // Max 7 days
      }

      // Generate all dates for this period
      const periodDates: string[] = [];
      for (let i = 0; i < periodLength; i++) {
        const date = new Date(periodStart);
        date.setDate(date.getDate() + i);
        periodDates.push(getFormattedDate(date));
      }

      // Remove period start date
      const newPeriodStartDates = periodStartDates.filter(
        (date) => date !== periodStartDate,
      );

      // Remove all period days
      const newAllPeriodDays = allPeriodDays.filter(
        (date) => !periodDates.includes(date),
      );

      setPeriodStartDates(newPeriodStartDates);
      setAllPeriodDays(newAllPeriodDays);

      localStorage.setItem(
        "periodStartDates",
        JSON.stringify(newPeriodStartDates),
      );
      localStorage.setItem("allPeriodDays", JSON.stringify(newAllPeriodDays));

      setToastMessage("Period removed");
      setShowToast(true);
    } catch (error) {
      console.error("Error removing period:", error);
      setToastMessage("Error removing period");
      setShowToast(true);
    }
  };

  // Generate calendar grid with proper weekday alignment
  const generateCalendarGrid = () => {
    try {
      const daysInMonth = getDaysInMonth(currentMonth);
      const firstDay = getFirstDayOfMonth(currentMonth);
      const currentMonthNum = currentMonth.getMonth();
      const currentYear = currentMonth.getFullYear();
      const grid = [];

      for (let i = 0; i < firstDay; i++) {
        grid.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        grid.push(getFormattedDate(new Date(currentYear, currentMonthNum, i)));
      }

      return grid;
    } catch (error) {
      console.error("Error generating calendar grid:", error);
      return [];
    }
  };

  // Get day name for calendar header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get latest logged period
  const getLatestPeriod = () => {
    if (periodStartDates.length === 0) return null;
    return periodStartDates[periodStartDates.length - 1];
  };

  // Get all cycle phases for display - FIXED: Uses biologically accurate phases
  const getAllCyclePhases = () => {
    const avgCycleLength = getAverageCycleLength();

    // Biologically accurate phase lengths for 28-day model
    // Can be adjusted based on actual average cycle length
    const menstrualEnd = 5;
    const follicularEnd = 12;
    const ovulationEnd = 15;

    return [
      { name: "Menstrual", start: 1, end: menstrualEnd, color: "#FF6B8B" },
      {
        name: "Follicular",
        start: menstrualEnd + 1,
        end: follicularEnd,
        color: "#4ECDC4",
      },
      {
        name: "Ovulation",
        start: follicularEnd + 1,
        end: ovulationEnd,
        color: "#FFD166",
      },
      {
        name: "Luteal",
        start: ovulationEnd + 1,
        end: avgCycleLength,
        color: "#06D6A0",
      },
    ];
  };

  const currentPhase = getCurrentCyclePhase();
  const irregularities = getIrregularCycles();
  const nextPeriod = predictNextPeriod();
  const ovulationDate = predictOvulation();
  const allPhases = getAllCyclePhases();
  const avgCycleLength = getAverageCycleLength();

  // Helper to check if we have enough data for meaningful statistics
  const hasEnoughDataForStats = periodStartDates.length >= 2;
  const hasEnoughDataForPredictions = periodStartDates.length >= 1;

  return (
    <AppLayout>
      <IonHeader className="bg-white ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => window.history.back()}>
              <IonIcon icon={arrowBack} className="text-[#4e9dbf]" />
            </IonButton>
          </IonButtons>
          <IonTitle className="font-semibold">Menstrual Cycle Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Model Disclaimer Banner */}
      <div className="border-b border-[#7dbdc8]/20 bg-gradient-to-r from-[#7dbdc8]/10 to-[#4e9dbf]/10">
        <div className="px-4 py-3 md:px-6">
          <div className="flex items-start space-x-3">
            <IonIcon
              icon={informationCircleOutline}
              className="text-[#4e9dbf] text-xl mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="mb-1 text-sm font-medium text-[#2c5c6c]">
                {hasEnoughDataForStats
                  ? `Personalized Tracker • ${avgCycleLength}-Day Average Cycle`
                  : "Educational Model: 28-Day Standard Cycle"}
              </p>
              <p className="text-xs text-[#4e9dbf]">
                Track your period dates locally. Data is stored on your device
                only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segment Control */}
      <div className="px-4 py-4 md:px-6">
        <IonSegment
          value={segment}
          onIonChange={(e) => {
            if (e.detail.value) {
              setSegment(e.detail.value as "overview" | "calendar" | "stats");
            }
          }}
          className="bg-white rounded-xl"
        >
          <IonSegmentButton value="overview">
            <IonLabel className="text-sm md:text-base">Overview</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="stats">
            <IonLabel className="text-sm md:text-base">Statistics</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="calendar">
            <IonLabel className="text-sm md:text-base">Calendar</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </div>

      {segment === "overview" && (
        <>
          {/* Cycle Progress with Phases */}
          <div className="px-4 mb-6 md:px-6">
            <IonCard className="overflow-hidden rounded-2xl">
              <IonCardHeader className="bg-gradient-to-r from-[#7dbdc8]/5 to-[#4e9dbf]/5">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <IonCardTitle className="text-base md:text-lg">
                    {periodStartDates.length > 0
                      ? `${hasEnoughDataForStats ? avgCycleLength : 28}-Day Cycle • Day ${currentDay}`
                      : "Menstrual Cycle Model"}
                  </IonCardTitle>
                  <div className="flex items-center space-x-2">
                    <IonChip
                      style={{
                        backgroundColor: `${currentPhase.color}20`,
                        color: currentPhase.color,
                        borderColor: currentPhase.color,
                      }}
                      className="font-medium"
                    >
                      {currentPhase.actualName}
                    </IonChip>
                  </div>
                </div>
              </IonCardHeader>
              <IonCardContent>
                {/* Cycle Progress with Phases */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2 text-xs text-gray-600 md:text-sm">
                    <span>Day 1</span>
                    <span className="font-semibold text-[#4e9dbf]">
                      Day {currentDay}
                    </span>
                    <span>
                      Day {hasEnoughDataForStats ? avgCycleLength : 28}
                    </span>
                  </div>

                  {/* Phase Progress Bar */}
                  <div className="h-3 mb-1 overflow-hidden bg-gray-200 rounded-full">
                    {allPhases.map((phase) => {
                      const displayCycleLength = hasEnoughDataForStats
                        ? avgCycleLength
                        : 28;
                      const phaseWidth =
                        ((phase.end - phase.start + 1) / displayCycleLength) *
                        100;
                      const isCurrentPhase =
                        currentDay >= phase.start && currentDay <= phase.end;

                      return (
                        <div
                          key={phase.name}
                          className="relative inline-block h-full"
                          style={{
                            width: `${phaseWidth}%`,
                            backgroundColor: phase.color,
                            opacity: isCurrentPhase ? 1 : 0.7,
                          }}
                        >
                          {isCurrentPhase && (
                            <div
                              className="absolute top-0 h-full w-0.5 bg-white"
                              style={{
                                left: `${((currentDay - phase.start) / (phase.end - phase.start + 1)) * 100}%`,
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Phase Labels */}
                  <div className="flex justify-between mt-3 mb-4">
                    {allPhases.map((phase) => (
                      <div
                        key={phase.name}
                        className="flex flex-col items-center"
                      >
                        <div
                          className="w-2 h-2 mb-1 rounded-full"
                          style={{ backgroundColor: phase.color }}
                        />
                        <span className="text-xs text-gray-600">
                          {phase.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Current Phase Info */}
                  <div
                    className="p-3 mt-4 rounded-lg"
                    style={{
                      backgroundColor: `${currentPhase.color}10`,
                      border: `1px solid ${currentPhase.color}20`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: currentPhase.color }}
                      >
                        Current: {currentPhase.actualName} Phase
                      </span>
                      <span className="text-xs text-gray-600">
                        Days {currentPhase.days[0]}-{currentPhase.days[1]}
                      </span>
                    </div>
                    {currentPhase.actualName === "Ovulation" && (
                      <p className="mt-1 text-xs text-gray-600">
                        Ovulation window: Increased fertility
                      </p>
                    )}
                  </div>
                </div>

                {/* Educational Note */}
                <div className="p-3 mt-4 bg-[#f9edd2] rounded-lg border border-[#b38216]/20">
                  <p className="text-xs text-[#b38216]">
                    <span className="font-semibold">Note:</span>
                    {periodStartDates.length > 0
                      ? ` Your last period started ${getActualDaysSinceLastPeriod()} days ago.`
                      : " Based on standard 28-day educational model."}
                    {hasEnoughDataForStats &&
                      ` Average cycle: ${avgCycleLength} days.`}
                    {!hasEnoughDataForStats &&
                      periodStartDates.length === 1 &&
                      " Log one more period for personalized statistics."}
                  </p>
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          {/* QUICK STATUS CARD */}
          <div className="px-4 mb-6 md:px-6">
            <IonCard className="rounded-2xl">
              <IonCardHeader>
                <div className="flex items-center justify-between">
                  <IonCardTitle className="flex items-center text-base md:text-lg">
                    <IonIcon
                      icon={analyticsOutline}
                      className="mr-2 text-[#4e9dbf]"
                    />
                    <span>Quick Stats & Predictions</span>
                  </IonCardTitle>
                  {periodStartDates.length > 0 && (
                    <button
                      onClick={() => setSegment("stats")}
                      className="text-sm text-[#4e9dbf] hover:text-[#2c5c6c] smooth-transition"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </IonCardHeader>
              <IonCardContent>
                {periodStartDates.length > 0 ? (
                  <div className="space-y-4">
                    {/* STATISTICS GRID */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 text-center rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">Cycle Day</p>
                        <p className="text-xl font-bold text-[#4e9dbf]">
                          {currentDay}/
                          {hasEnoughDataForStats ? avgCycleLength : 28}
                        </p>
                      </div>
                      <div className="p-3 text-center rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">Days Since</p>
                        <p className="text-xl font-bold text-gray-900">
                          {getActualDaysSinceLastPeriod()}
                        </p>
                      </div>
                    </div>

                    {/* PREDICTIONS */}
                    <div className="p-4 bg-gradient-to-r from-[#7dbdc8]/5 to-[#4e9dbf]/5 rounded-xl">
                      <h3 className="mb-3 text-sm font-semibold text-gray-900">
                        Predictions
                      </h3>
                      <div className="space-y-2">
                        {nextPeriod && hasEnoughDataForPredictions ? (
                          <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                            <div className="flex items-center space-x-2">
                              <IonIcon
                                icon={calendarClearOutline}
                                className="text-[#4e9dbf]"
                              />
                              <span className="text-sm font-medium">
                                Next Period
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">
                              {formatDate(nextPeriod)}
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 text-center bg-white border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-600">
                              {periodStartDates.length === 1
                                ? "Log one more period for predictions"
                                : "Log your first period for predictions"}
                            </p>
                          </div>
                        )}

                        {ovulationDate && hasEnoughDataForPredictions ? (
                          <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                            <div className="flex items-center space-x-2">
                              <IonIcon
                                icon={heart}
                                className="text-[#FF6B8B]"
                              />
                              <span className="text-sm font-medium">
                                Ovulation Window
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">
                              {formatDate(ovulationDate)}
                            </span>
                          </div>
                        ) : (
                          hasEnoughDataForPredictions && (
                            <div className="p-3 text-center bg-white border border-gray-200 rounded-lg">
                              <p className="text-sm text-gray-600">
                                Ovulation prediction available with cycle data
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* DATA STATUS */}
                    <div className="p-3 border border-[#b38216]/30 rounded-lg bg-[#f9edd2]">
                      <div className="flex items-center space-x-2">
                        <IonIcon
                          icon={analyticsOutline}
                          className="text-[#b38216]"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#b38216]">
                            {periodStartDates.length} period
                            {periodStartDates.length !== 1 ? "s" : ""} logged
                          </p>
                          <p className="text-xs text-[#b38216]/80">
                            {!hasEnoughDataForStats
                              ? "Log one more period for personalized statistics"
                              : "Personalized tracking active"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                      onClick={() => setSegment("calendar")}
                      className="w-full flex items-center justify-center space-x-2 p-3 text-[#4e9dbf] border border-[#4e9dbf]/30 rounded-lg hover:bg-[#4e9dbf]/5 smooth-transition"
                    >
                      <IonIcon icon={calendarOutline} />
                      <span className="text-sm font-medium">
                        Log Period or View History
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-[#7dbdc8]/10 to-[#4e9dbf]/10 rounded-full">
                      <IonIcon
                        icon={calendarOutline}
                        className="text-2xl text-[#4e9dbf]"
                      />
                    </div>
                    <p className="mb-2 text-gray-600">
                      No period dates logged yet
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                      Start tracking to see personalized predictions and
                      statistics
                    </p>
                    <button
                      onClick={() => setSegment("calendar")}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] text-white rounded-lg hover:opacity-90 smooth-transition"
                    >
                      <span>Log First Period</span>
                      <IonIcon icon={calendarOutline} />
                    </button>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        </>
      )}

      {segment === "stats" && (
        <div className="px-4 md:px-6">
          <IonCard className="rounded-2xl">
            <IonCardHeader>
              <div className="flex items-center justify-between">
                <IonCardTitle className="flex items-center text-base md:text-lg">
                  <IonIcon
                    icon={analyticsOutline}
                    className="mr-2 text-[#4e9dbf]"
                  />
                  <span>Cycle Statistics</span>
                </IonCardTitle>
                {periodStartDates.length > 0 && (
                  <IonBadge
                    style={{
                      background:
                        "linear-gradient(135deg, #7dbdc8 0%, #4e9dbf 100%)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    {periodStartDates.length} logged
                  </IonBadge>
                )}
              </div>
            </IonCardHeader>
            <IonCardContent>
              {periodStartDates.length > 0 ? (
                <div className="space-y-6">
                  {/* SUMMARY STATS */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 text-center rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500">Periods Logged</p>
                      <p className="text-xl font-bold text-gray-900">
                        {periodStartDates.length}
                      </p>
                    </div>
                    <div className="p-3 text-center rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500">Avg. Length</p>
                      <p className="text-xl font-bold text-gray-900">
                        {hasEnoughDataForStats
                          ? `${avgCycleLength} days`
                          : "Need more data"}
                      </p>
                    </div>
                    <div className="p-3 text-center rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500">Since Last</p>
                      <p className="text-xl font-bold text-gray-900">
                        {getActualDaysSinceLastPeriod()}
                      </p>
                    </div>
                  </div>

                  {/* PREDICTIONS - Only show with enough data */}
                  {hasEnoughDataForPredictions && (
                    <div className="p-4 bg-gradient-to-r from-[#7dbdc8]/10 to-[#4e9dbf]/10 rounded-xl">
                      <h3 className="mb-3 text-sm font-semibold text-gray-900">
                        {hasEnoughDataForStats
                          ? "Predictions"
                          : "Estimate (based on 28-day model)"}
                      </h3>
                      <div className="space-y-3">
                        {nextPeriod && (
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 flex items-center justify-center bg-[#4e9dbf]/10 rounded-lg">
                                <IonIcon
                                  icon={calendarClearOutline}
                                  className="text-[#4e9dbf]"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Next Period
                                </p>
                                <p className="text-xs text-gray-500">
                                  {hasEnoughDataForStats
                                    ? `Based on ${avgCycleLength}-day average`
                                    : "Based on 28-day model"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatDate(nextPeriod)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Expected date
                              </p>
                            </div>
                          </div>
                        )}
                        {ovulationDate && (
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 flex items-center justify-center bg-[#FF6B8B]/10 rounded-lg">
                                <IonIcon
                                  icon={heart}
                                  className="text-[#FF6B8B]"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Ovulation Window
                                </p>
                                <p className="text-xs text-gray-500">
                                  Fertile period{" "}
                                  {hasEnoughDataForStats
                                    ? "prediction"
                                    : "estimate"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatDate(ovulationDate)}
                              </p>
                              <p className="text-xs text-gray-500">± 3 days</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CYCLE IRREGULARITIES */}
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Cycle Regularity
                      </h3>
                      {irregularities.count > 0 ? (
                        <IonBadge
                          color="warning"
                          className="flex items-center space-x-1"
                        >
                          <IonIcon icon={warningOutline} />
                          <span>{irregularities.count} irregular</span>
                        </IonBadge>
                      ) : periodStartDates.length > 2 ? (
                        <IonBadge
                          color="success"
                          className="flex items-center space-x-1"
                        >
                          <IonIcon icon={checkmarkCircleOutline} />
                          <span>Regular</span>
                        </IonBadge>
                      ) : (
                        <IonBadge
                          style={{
                            background:
                              "linear-gradient(135deg, #7dbdc8 0%, #4e9dbf 100%)",
                            color: "white",
                          }}
                          className="flex items-center space-x-1"
                        >
                          <span>Need more data</span>
                        </IonBadge>
                      )}
                    </div>

                    {irregularities.count > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Cycles outside 21-35 days are considered irregular:
                        </p>
                        <div className="space-y-2">
                          {irregularities.cycles
                            .slice(0, 3)
                            .map((cycle, index) => (
                              <div
                                key={index}
                                className="p-3 border rounded-lg bg-amber-50 border-amber-200"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-amber-800">
                                      {cycle.startDate &&
                                        formatDate(cycle.startDate)}{" "}
                                      -{" "}
                                      {cycle.endDate &&
                                        formatDate(cycle.endDate)}
                                    </p>
                                    <p className="text-xs text-amber-600">
                                      {cycle.length} days •{" "}
                                      {cycle.type === "short"
                                        ? "Short cycle"
                                        : "Long cycle"}
                                    </p>
                                  </div>
                                  <IonIcon
                                    icon={
                                      cycle.type === "short"
                                        ? chevronBack
                                        : chevronForward
                                    }
                                    className="text-amber-600"
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : periodStartDates.length > 2 ? (
                      <div className="p-4 text-center border border-green-200 rounded-lg bg-green-50">
                        <IonIcon
                          icon={checkmarkCircleOutline}
                          className="mb-2 text-2xl text-green-500"
                        />
                        <p className="text-sm font-medium text-green-800">
                          Regular cycles detected
                        </p>
                        <p className="mt-1 text-xs text-green-600">
                          Your cycles are within the normal range (21-35 days)
                        </p>
                      </div>
                    ) : periodStartDates.length === 2 ? (
                      <div className="p-4 text-center border border-blue-200 rounded-lg bg-blue-50">
                        <p className="text-sm text-blue-600">
                          Log one more period to check regularity
                        </p>
                        <p className="mt-1 text-xs text-blue-500">
                          You have 2 periods logged. Need 3+ for regularity
                          analysis.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 text-center border border-[#b38216]/30 rounded-lg bg-[#f9edd2]">
                        <p className="text-sm text-[#b38216]">
                          Log more periods to see cycle regularity analysis
                        </p>
                        <p className="mt-1 text-xs text-[#b38216]/80">
                          Need at least 3 logged periods for regularity check.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CYCLE HISTORY - Only show with 2+ periods */}
                  {periodStartDates.length > 1 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-gray-900">
                        Cycle Length History
                      </h3>
                      <div className="space-y-2 overflow-y-auto max-h-60">
                        {periodStartDates.slice(1).map((date, index) => {
                          const startDate = parseDateString(
                            periodStartDates[index],
                          );
                          const endDate = parseDateString(date);
                          const diffDays = Math.ceil(
                            (endDate.getTime() - startDate.getTime()) /
                              (1000 * 60 * 60 * 24),
                          );
                          const isIrregular = diffDays < 21 || diffDays > 35;

                          return (
                            <div
                              key={date}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 smooth-transition"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Cycle {index + 1}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {periodStartDates[index] &&
                                    formatDate(periodStartDates[index])}{" "}
                                  → {date && formatDate(date)}
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`text-sm font-semibold ${isIrregular ? "text-amber-600" : "text-gray-700"}`}
                                >
                                  {diffDays} days
                                </span>
                                {isIrregular && (
                                  <IonIcon
                                    icon={warningOutline}
                                    className="text-amber-500"
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-[#7dbdc8]/10 to-[#4e9dbf]/10 rounded-full">
                    <IonIcon
                      icon={analyticsOutline}
                      className="text-2xl text-[#4e9dbf]"
                    />
                  </div>
                  <p className="mb-2 text-gray-600">No data available</p>
                  <p className="mb-4 text-sm text-gray-500">
                    Log your first period to see detailed statistics and
                    predictions
                  </p>
                  <button
                    onClick={() => setSegment("calendar")}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] text-white rounded-lg hover:opacity-90 smooth-transition"
                  >
                    <span>Go to Calendar</span>
                    <IonIcon icon={calendarOutline} />
                  </button>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      )}

      {segment === "calendar" && (
        <div className="px-4 md:px-6">
          {/* Calendar Navigation */}
          <div className="mb-6">
            <IonCard className="rounded-2xl">
              <IonCardHeader>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <IonCardTitle className="flex items-center text-base md:text-lg">
                    <IonIcon
                      icon={calendarOutline}
                      className="mr-2 text-[#4e9dbf]"
                    />
                    <span>Select Period Days</span>
                  </IonCardTitle>
                  <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                    <button
                      onClick={() => navigateMonth("prev")}
                      className="p-2 rounded-lg hover:bg-gray-100 smooth-transition"
                    >
                      <IonIcon icon={chevronBack} className="text-gray-600" />
                    </button>

                    {/* Month/Year Picker Button */}
                    <button
                      onClick={() => setShowMonthYearPicker(true)}
                      className="text-sm font-semibold text-gray-800 min-w-[120px] md:min-w-[140px] text-center hover:text-[#4e9dbf] smooth-transition p-2 rounded-lg hover:bg-gray-100"
                    >
                      {getMonthYear(currentMonth)}
                    </button>

                    <button
                      onClick={() => navigateMonth("next")}
                      className="p-2 rounded-lg hover:bg-gray-100 smooth-transition"
                    >
                      <IonIcon
                        icon={chevronForward}
                        className="text-gray-600"
                      />
                    </button>
                  </div>
                </div>
              </IonCardHeader>
              <IonCardContent className="p-2 sm:p-4">
                {/* Calendar Grid */}
                <div className="mb-4 sm:mb-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day, idx) => (
                      <div key={day} className="text-center">
                        <div
                          className={`text-xs font-medium py-1 ${
                            idx === 0
                              ? "text-red-400"
                              : idx === 6
                                ? "text-blue-400"
                                : "text-gray-500"
                          }`}
                        >
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {generateCalendarGrid().map((date, index) => (
                      <div
                        key={date || `empty-${index}`}
                        className="aspect-square"
                      >
                        {date ? (
                          <button
                            onClick={() => handleDateSelect(date)}
                            className={`w-full h-full flex items-center justify-center rounded-lg text-sm font-medium smooth-transition relative ${
                              isDateSelected(date)
                                ? "bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] text-white shadow-md"
                                : isPeriodDate(date)
                                  ? "bg-[#e2a31d]/20 text-[#b38216] border border-[#e2a31d]/30"
                                  : parseDateString(date) > getToday()
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-800 hover:bg-gray-100"
                            }`}
                            disabled={
                              parseDateString(date) > getToday() ||
                              isPeriodDate(date)
                            }
                          >
                            {date && parseDateString(date).getDate()}
                            {isPeriodStartDate(date) && (
                              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#e2a31d] rounded-full"></div> 
                            )}
                          </button>
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */} 
                <div className="mb-4 sm:mb-6"> 
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6"> 
                    <div className="flex items-center space-x-2"> 
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf]"></div> 
                      <span className="text-xs text-gray-600">Selected</span> 
                    </div> 
                    <div className="flex items-center space-x-2"> 
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#e2a31d]/20 border border-[#e2a31d]/30"></div> 
                      <span className="text-xs text-gray-600">Logged</span> 
                    </div> 
                    <div className="flex items-center space-x-2"> 
                      <div className="w-2 h-2 bg-gray-300 rounded-full sm:w-3 sm:h-3"></div> 
                      <span className="text-xs text-gray-600">Future</span> 
                    </div> 
                  </div> 
                </div> 

                {/* Selected Days Summary */}
                {selectedDays.length > 0 && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-[#7dbdc8]/10 to-[#4e9dbf]/10 rounded-xl border border-[#7dbdc8]/30">
                    <div className="flex flex-col justify-between gap-2 mb-3 sm:flex-row sm:items-center">
                      <div className="flex items-center space-x-2">
                        <IonBadge className="bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] text-white text-xs border-none">
                          {selectedDays.length} / 7
                        </IonBadge>
                        <span className="text-sm font-medium text-gray-900">
                          Consecutive Days Selected
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDays([]);
                          localStorage.setItem(
                            "selectedDays",
                            JSON.stringify([]),
                          );
                        }}
                        className="self-start text-xs text-[#4e9dbf] hover:text-[#2c5c6c] smooth-transition sm:self-auto"
                      >
                        Clear Selection
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {selectedDays.sort().map((date) => (
                        <div
                          key={date}
                          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#7dbdc8]/10 to-[#4e9dbf]/10 rounded-lg border border-[#7dbdc8]/30 text-xs sm:text-sm text-[#4e9dbf]"
                        >
                          {date &&
                            parseDateString(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-white rounded-lg border border-[#7dbdc8]/20">
                      <p className="mb-1 text-xs font-medium text-gray-900">
                        Period Summary:
                      </p>
                      <p className="text-xs text-gray-600">
                        Start date:{" "}
                        <span className="font-medium">
                          {selectedDays[0] && formatDate(selectedDays[0])}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600">
                        Duration:{" "}
                        <span className="font-medium">
                          {selectedDays.length} day
                          {selectedDays.length > 1 ? "s" : ""}
                        </span>
                      </p>
                      <p className="mt-2 text-xs text-[#4e9dbf]">
                        All selected days will be saved and appear in yellow on
                        the calendar.
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 sm:mt-3">
                      Tip: Click on dates before or after the current selection
                      to extend the range. Maximum 7 consecutive days.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={savePeriodDays}
                    className={`w-full flex items-center justify-center space-x-2 font-semibold py-3 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg smooth-transition active:opacity-90 text-sm sm:text-base ${
                      selectedDays.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] text-white"
                    }`}
                    disabled={selectedDays.length === 0}
                  >
                    <IonIcon
                      icon={saveOutline}
                      className="text-sm sm:text-base"
                    />
                    <span>
                      {selectedDays.length > 0
                        ? `Save Period (${selectedDays.length} day${selectedDays.length > 1 ? "s" : ""})`
                        : "Save Current Period"}
                    </span>
                  </button>
                  <p className="text-xs text-center text-gray-500">
                    Select up to 7 consecutive days to log your period. All
                    selected days will be saved and appear in yellow.
                  </p>
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          {/* PERIOD HISTORY */}
          {periodStartDates.length > 0 && (
            <div className="mb-6">
              <IonCard className="rounded-2xl">
                <IonCardHeader>
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <IonCardTitle className="flex items-center text-base md:text-lg">
                      <IonIcon
                        icon={listOutline}
                        className="mr-2 text-[#4e9dbf]"
                      />
                      <span>Period History</span>
                    </IonCardTitle>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {periodStartDates.length} period
                        {periodStartDates.length !== 1 ? "s" : ""} logged
                      </span>
                      <button
                        onClick={() => setShowClearAlert(true)}
                        className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-700 smooth-transition"
                      >
                        <IonIcon icon={trashOutline} className="text-sm" />
                        <span>Clear All</span>
                      </button>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <div className="space-y-4">
                    {/* ALL LOGGED PERIODS */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          All Logged Periods
                        </h3>
                        <button
                          onClick={() =>
                            setShowAllRecentLogged(!showAllRecentLogged)
                          }
                          className="flex items-center space-x-1 text-sm text-[#4e9dbf] hover:text-[#2c5c6c] smooth-transition"
                        >
                          <IonIcon
                            icon={showAllRecentLogged ? chevronUp : chevronDown}
                            className="text-sm"
                          />
                          <span>
                            {showAllRecentLogged ? "Show Less" : "Show All"}
                          </span>
                        </button>
                      </div>

                      {/* ALWAYS SHOW THE LATEST ONE */}
                      {getLatestPeriod() && (
                        <div className="p-3 mb-3 bg-gradient-to-r from-[#7dbdc8]/5 to-[#4e9dbf]/5 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-[#4e9dbf]/20">
                                <IonIcon
                                  icon={calendar}
                                  className="text-[#4e9dbf]"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {getLatestPeriod() &&
                                    formatDate(getLatestPeriod()!)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Most recent •{" "}
                                  {getLatestPeriod() &&
                                    formatCompactDate(getLatestPeriod()!)}{" "}
                                  • Day 1
                                </p>
                                <p className="text-xs text-amber-600">
                                  {(() => {
                                    // Count days for this period
                                    const periodStart = parseDateString(
                                      getLatestPeriod()!,
                                    );
                                    let periodDays = 1;
                                    for (let i = 1; i <= 7; i++) {
                                      const nextDay = new Date(periodStart);
                                      nextDay.setDate(nextDay.getDate() + i);
                                      if (
                                        allPeriodDays.includes(
                                          getFormattedDate(nextDay),
                                        )
                                      ) {
                                        periodDays++;
                                      } else {
                                        break;
                                      }
                                    }
                                    return `${periodDays} day${periodDays > 1 ? "s" : ""}`;
                                  })()}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                getLatestPeriod() &&
                                removePeriod(getLatestPeriod()!)
                              }
                              className="p-2 text-gray-400 rounded-lg hover:text-red-500 smooth-transition hover:bg-red-50"
                            >
                              <IonIcon icon={trashOutline} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* SHOW ADDITIONAL ONES WHEN EXPANDED */}
                      {showAllRecentLogged && periodStartDates.length > 1 && (
                        <div className="space-y-2 overflow-y-auto max-h-96">
                          {[...periodStartDates]
                            .slice(0, -1)
                            .reverse()
                            .map((date, index) => (
                              <div
                                key={date}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 smooth-transition"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                                    <span className="text-xs font-medium text-gray-600">
                                      {periodStartDates.length - index - 1}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {date && formatDate(date)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {date && formatCompactDate(date)}
                                    </p>
                                    <p className="text-xs text-amber-600">
                                      {(() => {
                                        // Count days for this period
                                        const periodStart =
                                          parseDateString(date);
                                        let periodDays = 1;
                                        for (let i = 1; i <= 7; i++) {
                                          const nextDay = new Date(periodStart);
                                          nextDay.setDate(
                                            nextDay.getDate() + i,
                                          );
                                          if (
                                            allPeriodDays.includes(
                                              getFormattedDate(nextDay),
                                            )
                                          ) {
                                            periodDays++;
                                          } else {
                                            break;
                                          }
                                        }
                                        return `${periodDays} day${periodDays > 1 ? "s" : ""}`;
                                      })()}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removePeriod(date)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 smooth-transition rounded-lg hover:bg-red-50"
                                >
                                  <IonIcon
                                    icon={trashOutline}
                                    className="text-sm"
                                  />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* SHOW VIEW ALL BUTTON IF NOT EXPANDED AND MORE THAN 1 */}
                      {!showAllRecentLogged && periodStartDates.length > 1 && (
                        <button
                          onClick={() => setShowAllRecentLogged(true)}
                          className="w-full flex items-center justify-center space-x-2 p-3 text-sm text-[#4e9dbf] hover:text-[#2c5c6c] smooth-transition border border-dashed border-gray-300 rounded-lg hover:border-[#4e9dbf]/30 hover:bg-[#4e9dbf]/5"
                        >
                          <IonIcon icon={eyeOutline} className="text-sm" />
                          <span>
                            View {periodStartDates.length - 1} more logged
                            period{periodStartDates.length - 1 > 1 ? "s" : ""}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          )}
        </div>
      )}

      {/* Month/Year Picker Modal */}
      <IonModal
        isOpen={showMonthYearPicker}
        onDidDismiss={() => setShowMonthYearPicker(false)}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.5, 0.75]}
        handleBehavior="cycle"
        className="ion-modal-rounded"
      >
        <IonHeader className="bg-white shadow-none ion-no-border">
          <IonToolbar className="bg-white">
            <div className="flex items-center justify-between px-4 py-2 bg-white">
              <div className="flex-1"></div>
              <IonTitle className="p-0 text-lg font-semibold text-center bg-white">
                Select Month & Year
              </IonTitle>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent className="bg-white ion-padding" scrollY={true}>
          <div className="p-4 bg-white">
            {/* SIMPLE MONTH/YEAR PICKER */}
            <div className="mb-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Select Month
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <button
                    key={month}
                    onClick={() => {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(index);
                      setCurrentMonth(newDate);
                    }}
                    className={`p-3 text-center rounded-lg border ${
                      currentMonth.getMonth() === index
                        ? "bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] text-white border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    } smooth-transition`}
                  >
                    <span className="text-sm font-medium">
                      {month.substring(0, 3)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Select Year
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 11 }, (_, i) => {
                  const year = 2020 + i;
                  return (
                    <button
                      key={year}
                      onClick={() => {
                        const newDate = new Date(currentMonth);
                        newDate.setFullYear(year);
                        setCurrentMonth(newDate);
                      }}
                      className={`p-3 text-center rounded-lg border ${
                        currentMonth.getFullYear() === year
                          ? "bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] text-white border-transparent"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      } smooth-transition`}
                    >
                      <span className="text-sm font-medium">{year}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Toast Notification */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        style={{
          "--background": "linear-gradient(135deg, #7dbdc8 0%, #4e9dbf 100%)",
          "--color": "white", // Optional: change text color if needed
          "--border-radius": "8px", // Optional: add border radius
        }}
      />

      {/* Clear All Alert */}
      <IonAlert
        isOpen={showClearAlert}
        onDidDismiss={() => setShowClearAlert(false)}
        header="Clear All Data"
        message="Are you sure you want to delete all logged period dates? This cannot be undone."
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Clear All",
            role: "destructive",
            handler: clearAllData,
          },
        ]}
      />
    </AppLayout>
  );
};

export default PeriodTracker;
