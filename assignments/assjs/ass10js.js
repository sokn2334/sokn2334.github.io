JSON = {
    "company": [
        {
          "companyName": "Tech Stars", //Problem 2
          "website": "www.techstars.site",
          "employees": [ //Problem 1
            {
              "firstName": "Sam",
              "department": "Tech",
              "designation": "Manager",
              "salary": 40000,
              "raiseEligible": true,
              "wfh": true,
            },
            {
              "firstName": "Mary",
              "department": "Finance",
              "designation": "Trainee",
              "salary": 18500,
              "raiseEligible": true,
              "wfh": false,
            },
            {
              "firstName": "Bill",
              "department": "HR",
              "designation": "Executive",
              "salary": 21200,
              "raiseEligible": false,
              "wfh": false,
            },
            {
                "firstName": "Anna", //Problem 3
                "department": "Tech",
                "designation": "Executive",
                "salary": 25600,
                "raiseEligible": false,
                "wfh": true,
            },
          ],
        }
      ]
  }

console.log("Problem 1: ");
for (let i = 0; i < 3; i++){
    console.log(JSON.company[0].employees[i].firstName, JSON.company[0].employees[i].department, JSON.company[0].employees[i].designation, JSON.company[0].employees[i].salary, JSON.company[0].employees[i].raiseEligible);
};

console.log("Problem 2: ");
console.log(JSON.company[0].companyName, JSON.company[0].website, JSON.company[0].employees);

console.log("Problem 3: ");
console.log(JSON.company[0].employees[3].firstName, JSON.company[0].employees[3].department, JSON.company[0].employees[3].designation, JSON.company[0].employees[3].salary, JSON.company[0].employees[3].raiseEligible)
  


//Problem 4: Total of Salaries
let total = 0;
for (let i = 0; i < 4; i++){
    total += JSON.company[0].employees[i].salary;
};
console.log("Problem 4: ");
console.log("The total salary is", total);



//Problem 5: Raises
console.log("Problem 5: ");
for (let i = 0; i < 4; i++){
    if(JSON.company[0].employees[i].raiseEligible === true)
    {
        let oldSalary = JSON.company[0].employees[i].salary;
        let newSalary = oldSalary + (oldSalary * 0.1);
        console.log(JSON.company[0].employees[i].firstName, "'s previous salary was ", oldSalary, " and is now ", newSalary);
        JSON.company[0].employees[i].salary = newSalary;
        JSON.company[0].employees[i].raiseEligible = false;
    }
};

      