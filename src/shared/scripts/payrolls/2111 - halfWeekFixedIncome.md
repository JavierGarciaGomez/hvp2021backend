Ok I want you to create a script similar to the parseTickets one but this one is for create a json of payrolls

The first thing you need to do is get all the collaborators in the backend

then you should import the data of the payroll: src/shared/scripts/data/payroll.xlsx

this has this format
Date Código Concepto Beneficiario Ingreso Egreso
15-ene-24 2111 Sueldo AAA AAA $- $3,920.00
31-ene-24 2111 Sueldo AAA AAA $- $3,920.00
15-feb-24 2111 Sueldo AAA AAA $- $3,920.00
29-feb-24 2111 Sueldo AAA AAA $- $3,920.00
15-mar-24 2111 Sueldo AAA AAA $- $3,920.00
31-mar-24 2111 Sueldo AAA AAA $- $3,920.00

I need to create payrolls a payroll for every date and Beneficiario.

From here you need to get the collaborator from the data base and generate a payroll entity in json.

Every row has a code this code should be inserted into the corresponding payroll concept from the list that is in the end.

If there is more than one you need to sum them

About the root data:

- jobId it should be the job id that is in the collaborator
- payroll status: paid
- periodEndDate: this should be the date in the date, but it needs to be the last time of a day in mexico of that date, you should find a helper in the code
- periodStartDate: this should be the start of the day date of the date that started that halfweek. For example 1/1/25 to 15/1/24 or 16/1/24 to 31/1/24.

About the general data: you can grab everything from the collaborator. if you cant just use 0. The job title you can get it from the job.

you need to calculate the totals.

All that you cant generate just write 0

In the end just save it as payrollOutput.json

2111 - halfWeekFixedIncome
2132 - vacationBonus
2133 - doubleOvertimeHours
2134 - sundayBonus
2136 - holidayOrRestExtraPay
2137 - endYearBonus
2141 - socialSecurityWithholding
2144 - otherFixedDeductions (name: Retención crédito Infonavit)
2155 - trainingActivitySupport
2171 - commissions
2172 starts with Compensación Montejo - expressBranchCompensation
2172 starts with Compensación por alimentos - mealCompensation
2172 startis with Compensación por vacaciones - vacationCompensation
2172 starts with Compensación extra - extraVariableCompensations
2172 starts with Compensación por faltas - absencesJustifiedByCompanyCompensation
2172 starts with Compensación por ingreso mínimo - guaranteedPerceptionCompensation
2172 rest - extraVariableCompensations
2173 - punctualityBonus
2174 - halfWeekFixedIncome
2812 - incomeTaxWithholding
2813 - employmentSubsidy
