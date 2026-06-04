---
layout: post
title: "软件工程期末测试题"
tags: [期末复习]
---
> This practice test covers all 16 lectures of the course. It is designed to verify your understanding of the key concepts.
>
> **Structure**: 30 MCQs + 10 Fill-in-the-Blanks + 15 True / False + 10 Short Answers + 4 Comprehensive Problems = **Total 200 points**
>
> **Suggested time**: 3 hours
>
> **Answers are at the end**. Complete all questions first, then check your answers.

## Part 1: Multiple Choice Questions (30 × 3' = 90')

**Choose the ONE correct answer for each question.**

**Q1.** Which of the following is NOT one of the four fundamental quality attributes of software?

- A. Maintainability
- B. Portability
- C. Dependability
- D. Usability

**Q2.** In the definition of software engineering, the most essential keyword is:

- A. Fast development
- B. Disciplined approach
- C. Object-oriented programming
- D. User satisfaction

**Q3.** The Waterfall model is NOT suitable for which of the following scenarios?

- A. Embedded systems development
- B. Safety-critical systems
- C. Projects with frequently changing requirements
- D. Small projects with well-defined requirements

**Q4.** What is the most distinctive feature of the Spiral model that separates it from other process models?

- A. Iterative development
- B. Incremental delivery
- C. Risk-driven analysis
- D. Use-case driven

**Q5.** The correct order of the four phases of RUP (Rational Unified Process) is:

- A. Construction → Elaboration → Inception → Transition
- B. Inception → Elaboration → Construction → Transition
- C. Inception → Construction → Elaboration → Transition
- D. Elaboration → Inception → Transition → Construction

**Q6.** In Scrum, who is responsible for defining the Product Backlog and prioritizing items?

- A. Scrum Master
- B. Development Team
- C. Product Owner
- D. Project Manager

**Q7.** Which of the following is a **non-functional** requirement?

- A. The system shall allow users to post used book information
- B. The system response time shall be within 300ms
- C. Buyers can search and browse books
- D. The system shall save all transaction records

**Q8.** Non-functional requirements can be classified into three categories. Which of the following belongs to **Product Requirements**?

- A. Legal and regulatory compliance
- B. Interoperability requirements
- C. Performance requirements
- D. Mandatory use of a specific development tool

**Q9.** In requirements validation, checking "there are no contradictions between requirements" corresponds to:

- A. Validity
- B. Consistency
- C. Completeness
- D. Verifiability

**Q10.** In a UML class diagram, which symbol represents **Composition**?

- A. Solid line + hollow diamond
- B. Solid line + filled diamond
- C. Solid line + hollow triangle arrow
- D. Dashed line + hollow triangle arrow

**Q11.** In a UML class diagram, if class A uses class B as a parameter in one of its methods, the relationship between A and B is most likely:

- A. Generalization
- B. Aggregation
- C. Dependency
- D. Realization

**Q12.** In a use case diagram, `A <<include>> B` means:

- A. Use case A **optionally uses** the functionality of use case B
- B. Use case A **always executes** the functionality of use case B
- C. Use case A **is a specialization of** use case B
- D. Use case A **extends** use case B when certain conditions are met

**Q13.** In a sequence diagram, how is a Lifeline represented?

- A. Rounded rectangle + dashed line
- B. Rectangle + downward dashed line
- C. Ellipse + solid line
- D. Rectangle + upward solid line

**Q14.** Which UML diagram is best suited to describe **the state changes of an Order object throughout its lifecycle**?

- A. Activity Diagram
- B. Sequence Diagram
- C. State Machine Diagram
- D. Class Diagram

**Q15.** Which statement correctly describes the difference between OOA (Object-Oriented Analysis) and OOD (Object-Oriented Design)?

- A. OOA focuses on "how", OOD focuses on "what"
- B. OOA focuses on "what", OOD focuses on "how"
- C. OOA is a design phase, OOD is an analysis phase
- D. There is no essential difference between them

**Q16.** Which architectural pattern is most suitable for **a data processing pipeline (e.g., a compiler that transforms source code step by step into machine code)**?

- A. MVC (Model-View-Controller)
- B. Pipe-and-Filter
- C. Repository
- D. Event-driven

**Q17.** In the MVC architecture, the primary responsibility of the **Controller** is:

- A. Managing data and business logic
- B. Rendering the UI
- C. Processing user input and coordinating Model and View
- D. Storing database data

**Q18.** Which SOLID principle states that "subtypes must be substitutable for their base types without affecting the correctness of the program"?

- A. Single Responsibility Principle (SRP)
- B. Open / Closed Principle (OCP)
- C. Liskov Substitution Principle (LSP)
- D. Interface Segregation Principle (ISP)

**Q19.** The classic example of **Square inheriting from Rectangle violating the parent class's behavioral contract** violates which principle?

- A. Single Responsibility Principle (SRP)
- B. Open / Closed Principle (OCP)
- C. Liskov Substitution Principle (LSP)
- D. Dependency Inversion Principle (DIP)

**Q20.** In the GRASP principles, "Information Expert" means:

- A. The class that possesses the needed information should be responsible for performing the operation
- B. The most senior developer should assign responsibilities
- C. The controller class should handle all operations
- D. The data access layer should handle all business logic

**Q21.** In structured design, which type of **coupling is the WORST**?

- A. Data Coupling
- B. Control Coupling
- C. Common Coupling
- D. Content Coupling

**Q22.** In structured design, which type of **cohesion is the BEST**?

- A. Functional Cohesion
- B. Sequential Cohesion
- C. Temporal Cohesion
- D. Procedural Cohesion

**Q23.** In a DFD (Data Flow Diagram), a **circle / ellipse** represents:

- A. Data Store
- B. External Entity
- C. Process / Bubble
- D. Data Flow

**Q24.** The correct English definitions of Verification and Validation are:

- A. Verification = "Are we building the right product?"
- B. Validation = "Are we building the product right?"
- C. Verification = "Are we building the product right?"
- D. Both terms mean the same thing

**Q25.** Equivalence Partitioning and Boundary Value Analysis belong to which testing method?

- A. White-box Testing
- B. Black-box Testing
- C. Unit Testing
- D. Regression Testing

**Q26.** Which type of auxiliary module is needed in **Bottom-up** integration testing?

- A. Stub
- B. Driver
- C. Spy
- D. Mock Object

**Q27.** A program contains **3 if statements** (independent, not nested). Its Cyclomatic Complexity is:

- A. 3
- B. 4
- C. 5
- D. 6

**Q28.** In Configuration Management, a "formally reviewed and approved configuration snapshot that serves as a reference point for future changes" is called a:

- A. Configuration Item (CI)
- B. Baseline
- C. Branch
- D. Version

**Q29.** In the COCOMO model, which project type is suitable for "high hardware constraints, real-time requirements, and extreme complexity"?

- A. Organic
- B. Embedded
- C. Semi-detached
- D. Critical

**Q30.** The core meaning of Brooks' Law is:

- A. Software complexity grows exponentially with size
- B. Adding manpower to a late software project makes it later
- C. Work expands to fill the time available
- D. Software cost estimation is inherently unreliable

## Part 2: Fill-in-the-Blanks (10 × 2' = 20')

**Fill in each blank with the most appropriate term.**

**Q31.** Software = Programs + \_\_\_\_\_\_ + Data.

**Q32.** The Agile Manifesto values: "Individuals and interactions" over processes and tools; "Working software" over comprehensive documentation; "Customer collaboration" over contract negotiation; "\_\_\_\_\_\_" over following a plan.

**Q33.** In UML class diagrams, Aggregation is represented by a hollow diamond, while Composition is represented by a \_\_\_\_\_\_ diamond.

**Q34.** In UML class diagrams, the visibility modifier `#` represents \_\_\_\_\_\_ (access level).

**Q35.** In object orientation, \_\_\_\_\_\_ and \_\_\_\_\_\_ are often confused: the former focuses on "what it looks like from outside", the latter focuses on "how to hide internal implementation".

**Q36.** In SOLID, D stands for Dependency Inversion Principle. The core idea is: depend upon \_\_\_\_\_\_ rather than upon concrete implementations.

**Q37.** The two core evaluation criteria in structured design are Coupling and \_\_\_\_\_\_. Good design pursues low coupling + \_\_\_\_\_\_.

**Q38.** Code coverage from weakest to strongest: Statement Coverage → \_\_\_\_\_\_ → Condition Coverage → Path Coverage.

**Q39.** In Configuration Management, CCB stands for \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_.

**Q40.** The five dimensions of Function Point Analysis are: External Inputs (EI), External Outputs (EO), External Inquiries (EQ), Internal Logical Files (ILF), and \_\_\_\_\_\_\_\_\_\_\_\_ (EIF).

## Part 3: True or False (15 × 2' = 30')

**Mark ✓ for true or ✗ for false.**

**Q41.** The software crisis only occurred in the 1960s; modern software development no longer faces it. ( )

**Q42.** Incremental development and Iterative development are the same concept — both deliver software in steps. ( )

**Q43.** In RUP's four phases, the core goal of the Elaboration phase is to determine the project scope and identify key use cases. ( )

**Q44.** In a class diagram, if a class can exist independently of its associated class, the relationship between them could be Aggregation or Association. ( )

**Q45.** In the OOA (Object-Oriented Analysis) phase, the analyst should first consider implementation details such as database design and network architecture. ( )

**Q46.** A significant disadvantage of Layered Architecture is performance overhead, because requests must pass through multiple layers. ( )

**Q47.** The Open / Closed Principle (OCP) means that once code is written, it can never be modified. ( )

**Q48.** Design patterns are classified into three categories: Creational, Structural, and Behavioral. ( )

**Q49.** In a DFD (Data Flow Diagram), a process may have only an input flow and no output flow. ( )

**Q50.** Black-box testing requires knowledge of the internal code structure to design effective test cases. ( )

**Q51.** Top-down integration testing requires Stubs to simulate lower-level modules. ( )

**Q52.** The higher the Cyclomatic Complexity, the better the code quality. ( )

**Q53.** Equivalence Partitioning only needs to consider valid equivalence classes; invalid equivalence classes can be ignored. ( )

**Q54.** Version Control is the entirety of Configuration Management. ( )

**Q55.** Function Point Analysis is a programming-language-independent method for estimating software size. ( )

## Part 4: Short Answer Questions (10 × 6' = 60')

**Keep answers clear and concise. Aim for 3-6 sentences per question.**

**Q56.** What is the "software crisis"? List three typical symptoms and briefly explain its root cause.

**Q57.** Explain the difference between Functional Requirements and Non-functional Requirements. Give one concrete example of each for "an online payment system."


**Q58.** In UML class diagrams, briefly explain the difference between Aggregation and Composition. Provide one real-world example for each.

**Q59.** Explain the Open / Closed Principle (OCP) and the Liskov Substitution Principle (LSP) from SOLID. Give one example of a violation for each.

**Q60.** Compare Transform Analysis and Transaction Analysis. Explain which DFD scenario each is suitable for in structured design.

**Q61.** Compare Black-box Testing and White-box Testing. Give one representative testing technique for each, and state one advantage and one disadvantage of each.

**Q62.** Explain the difference between a Stub and a Driver. State which integration testing strategy each is used in.

**Q63.** What is Regression Testing? Why is it important? How is regression testing typically automated?

**Q64.** List the four main activities of Configuration Management (CM), and briefly describe the purpose of each.

**Q65.** Explain Brooks' Law: its content, the reasons behind it, and why adding people does not linearly shorten project duration.

## Part 5: Comprehensive Application Problems (4 problems, total 70')

**Q66. (15') Process Model and Architecture Selection**

A company is developing a **hospital outpatient management system** with the following features:

- Patients can book appointments online and view their appointment history
- Doctors can view the day's patient list, enter diagnoses and prescriptions
- The pharmacy prepares medicine based on prescriptions
- Administrators manage users and master data

Requirements characteristics:

- Core functions are relatively clear (established workflow for appointments, diagnosis, and medication)
- The system may need to integrate with external systems (health insurance system, lab test system) in the future
- High concurrency is needed during peak hours (holidays)
- Patient data is sensitive, requiring high security

Answer the following:

1. Which software process model would you choose? Give at least two reasons.
2. Which architectural pattern(s) would you recommend? Explain your reasoning.
3. To support future external system integration (e.g., the health insurance API), which SOLID principle should you apply? How would you implement it?

**Q67. (20') UML Comprehensive Modeling**

A campus event management system has the following requirements:

> **Organizers** can publish **Events** (with event name, time, location, and capacity limit). **Students** can browse the event list and register for events. Each event has a capacity limit — once full, no further registrations are accepted. After a student registers, the system generates a **Registration** record. After an event ends, the organizer can publish a **Summary**. Students can write **Reviews** for events they have attended. **Admins** can review events and users, and freeze violating accounts.

Answer the following:

1. Identify the **Actors** and their corresponding **Use Cases**. Describe the use case diagram in words.
2. Identify the core classes and describe the **class diagram** (relationship types and multiplicity) in words.
3. Draw a **sequence diagram** for the "Student registers for an Event" use case (describe the message flow in words).

**Q68. (20') Testing Design**

A system's "User Registration" function has these requirements:

> **Username**: 6-20 characters long, may only contain letters (A-Z, a-z) and digits (0-9), must not start with a digit.
> **Password**: 8-30 characters long, must contain at least one uppercase letter, one lowercase letter, and one digit.

Answer the following:

1. Using **Equivalence Partitioning**, design equivalence classes for the **username** (include both valid and invalid classes).
2. Using **Boundary Value Analysis**, design test cases for the username boundaries.
3. Here is the username validation code:

```java
boolean isValidUsername(String username) {
    if (username == null) return false;
    int len = username.length();
    if (len < 6 || len > 20) return false;
    if (Character.isDigit(username.charAt(0))) return false;
    for (char c : username.toCharArray()) {
        if (!Character.isLetterOrDigit(c)) return false;
    }
    return true;
}
```

Calculate the **Cyclomatic Complexity** of this method and explain what it means.

4. To achieve **100% branch coverage** on this code, what is the minimum number of test cases needed?

**Q69. (15') Configuration Management and Cost Estimation**

A project has completed requirements analysis and design, and is entering the coding phase. Here are the parameters:

| Parameter | Value |
|-----------|-------|
| Estimated code size | 50 KLOC |
| Project type | Semi-detached |
| Current team size | 6 people |
| a (Effort) | 3.0 |
| b | 1.12 |
| c (Time) | 2.5 |
| d | 0.35 |

Answer the following:

1. Using the basic COCOMO model, calculate:
   - Estimated effort (Effort) = ? person-months
   - Estimated duration (Time) = ? months
   - Estimated required staff = ? people
2. The current team has only 6 people, much less than the estimate. The project manager wants to **add 3 more people** to catch up. Analyze the risks using Brooks' Law.
3. Is Git a centralized or distributed version control system? Which **branch strategy** would you recommend for this team? Give your reasoning.

## Answer Key

### Part 1: Multiple Choice Answers

| # | Answer | Explanation |
|---|--------|-------------|
| Q1 | **B** | The four attributes are Maintainability, Dependability, Efficiency, and Usability. Portability is not included. |
| Q2 | **B** | Software engineering is about applying a systematic, disciplined, quantifiable approach. "Disciplined approach" is the key. |
| Q3 | **C** | The Waterfall model is linear and cannot accommodate changing requirements. Projects with frequent changes need iterative / agile approaches. |
| Q4 | **C** | Each Spiral cycle includes risk analysis — this risk-driven nature is its unique feature. |
| Q5 | **B** | Inception → Elaboration → Construction → Transition. |
| Q6 | **C** | The Product Owner manages the Product Backlog and prioritizes items. The Scrum Master ensures the process is followed. |
| Q7 | **B** | "Response time within 300ms" is a performance requirement, which is non-functional. The others describe system behavior (functional). |
| Q8 | **C** | Product requirements include performance, reliability, usability, and security. A and B are external requirements; D is an organizational requirement. |
| Q9 | **B** | Consistency checks that requirements do not contradict each other. |
| Q10 | **B** | Composition = solid line + filled diamond; Aggregation = solid line + hollow diamond. |
| Q11 | **C** | Dependency — class A temporarily uses class B (e.g., as a method parameter). |
| Q12 | **B** | `<<include>>` means A always executes B; A is incomplete without B. `<<extend>>` is conditional. |
| Q13 | **B** | Lifeline = rectangle (objectName:ClassName) + a downward dashed line. |
| Q14 | **C** | State Machine Diagrams describe an object's state changes. Activity Diagrams describe business process steps. |
| Q15 | **B** | OOA = analyze the problem ("what" / problem domain), OOD = design the solution ("how" / solution domain). This is a very common exam question. |
| Q16 | **B** | Pipe-and-Filter is the best fit for data flowing through a series of transformations (e.g., compilers, Unix pipes). |
| Q17 | **C** | Model manages data; View displays the UI; Controller handles input and coordinates Model and View. |
| Q18 | **C** | LSP (Liskov Substitution Principle) states that subtypes must be substitutable for their base types. |
| Q19 | **C** | Square inheriting Rectangle violates LSP because calling setWidth on a Square also changes the height, breaking the parent's behavioral contract. |
| Q20 | **A** | Information Expert: assign responsibility to the class that has the data needed to perform it. |
| Q21 | **D** | Coupling from best to worst: Data < Stamp < Control < Common < Content. Content coupling (directly accessing another module's internals) is the worst. |
| Q22 | **A** | Cohesion from best to worst: Functional > Sequential > Communicational > Procedural > Temporal > Logical > Coincidental. |
| Q23 | **C** | DFD notation: circle / ellipse = Process, arrow = Data Flow, parallel lines = Data Store, rectangle = External Entity. |
| Q24 | **C** | Verification = "Are we building the product right?" (checking specification compliance). Validation = "Are we building the right product?" (checking user needs). |
| Q25 | **B** | Equivalence Partitioning and BVA are black-box techniques (they only consider inputs / outputs, not internal code). |
| Q26 | **B** | Bottom-up needs **Driver** to simulate the calling module. Top-down needs **Stub**. |
| Q27 | **B** | Cyclomatic Complexity = decision nodes + 1 = 3 + 1 = 4. Each `if` is one decision node. |
| Q28 | **B** | A Baseline is a formally reviewed and approved configuration that serves as a reference point for future changes. |
| Q29 | **B** | Embedded type = strong constraints, high complexity (e.g., flight control, ATMs). Organic = small, simple projects. |
| Q30 | **B** | Brooks' Law: "Adding manpower to a late software project makes it later." Parkinson's Law is about work expanding to fill available time. |

### Part 2: Fill-in-the-Blank Answers

| # | Answer |
|---|--------|
| Q31 | **Documentation** |
| Q32 | **Responding to change** |
| Q33 | **filled (or solid)** |
| Q34 | **protected** |
| Q35 | **Abstraction**, **Encapsulation** |
| Q36 | **abstractions** (or interfaces / abstract classes) |
| Q37 | **Cohesion**, **high cohesion** |
| Q38 | **Branch Coverage** (or Decision Coverage) |
| Q39 | **Change Control Board** |
| Q40 | **External Interface Files** |

### Part 3: True / False Answers

| # | Answer | Explanation |
|---|--------|-------------|
| Q41 | **✗** | The software crisis still exists today (software complexity continues to grow). |
| Q42 | **✗** | Incremental = adding features (building blocks); Iterative = improving the whole system (sculpting). They are different. |
| Q43 | **✗** | Elaboration focuses on architecture design and resolving core risks. Inception determines the project scope. |
| Q44 | **✓** | Aggregation and Association are both weak relationships. Composition requires the part to die with the whole. |
| Q45 | **✗** | OOA should not consider implementation details — analysis is technology-independent. |
| Q46 | **✓** | In layered architecture, requests must pass through multiple layers, adding overhead. |
| Q47 | **✗** | OCP doesn't mean "never modify." It means add features through extension (new code) rather than modifying existing code. Core abstractions may need changes. |
| Q48 | **✓** | Design patterns are classified into three categories: Creational, Structural, and Behavioral. |
| Q49 | **✗** | Every DFD process must have both input and output flows (it cannot produce or consume data from nothing). |
| Q50 | **✗** | Black-box testing is the opposite — it does NOT look at internal code. |
| Q51 | **✓** | In top-down testing, Stubs simulate lower-level modules that are not yet implemented. |
| Q52 | **✗** | Higher Cyclomatic Complexity means the code is more complex, harder to test and maintain. CC > 10 usually suggests refactoring. |
| Q53 | **✗** | Both valid and invalid equivalence classes must be considered. Invalid classes test how the system handles illegal input. |
| Q54 | **✗** | Version control is only part of Configuration Management. CM also includes identification, control, auditing, and status accounting. |
| Q55 | **✓** | Function Point Analysis estimates size based on functional requirements, independent of programming language. |

### Part 4: Short Answer Key Points

**Q56. Software Crisis**

- Definition: Since the 1960s, software projects have frequently suffered from schedule overruns, budget overruns, poor quality, and maintenance difficulties.
- Three symptoms: (1) Schedule and cost失控 (overruns); (2) Poor quality — many defects, low reliability; (3) Maintenance difficulty — high cost to modify code, changes introduce new bugs.
- Root cause: Software complexity grows faster than development capability.

**Q57. Functional vs Non-functional Requirements**

- Functional requirements: describe **what** the system does (specific behaviors). Example: "The online payment system shall allow users to enter credit card information to complete a payment."
- Non-functional requirements: describe **how well** the system performs (quality attributes or constraints). Example: "Payment processing must complete within 3 seconds. Payment data must be encrypted using SSL / TLS."
- Key distinction: functional = behavior; non-functional = property / constraint.

**Q58. Aggregation vs Composition**

- Aggregation: weak whole-part relationship; the part can exist independently. Represented by a hollow diamond. Example: **Chairs** in a **classroom** (chairs can be moved to another room).
- Composition: strong whole-part relationship; the part cannot exist independently. Represented by a filled diamond. Example: **Heart** of a **person** (the heart cannot live outside the body).
- Memory aid: Hollow = "part can be hollowed out" (independent); Filled = "part is firmly attached" (dependent).

**Q59. OCP and LSP**

- OCP (Open/Closed Principle): Open for extension, closed for modification. Add features through new classes, not by changing existing code. **Violation example**: Adding a new shape type requires modifying a switch-case in the drawing function.
- LSP (Liskov Substitution Principle): Subtypes must be substitutable for their base types. **Violation example**: Square inheriting Rectangle — calling setWidth on Square also changes its height, violating "changing width does not change height."

**Q60. Transform Analysis vs Transaction Analysis**

- Transform Analysis: Suitable for DFDs with a clear "input → transform center → output" data flow pattern. Maps the incoming flow, transform center, and outgoing flow into input modules, transform modules, and output modules in a structure chart.
- Transaction Analysis: Suitable for DFDs with a "transaction center" that dispatches to different processing paths based on input type. Maps to a dispatcher + multiple processing branches.
- Choosing: Pipeline data flow → Transform Analysis; Multi-branch dispatch → Transaction Analysis.

**Q61. Black-box vs White-box Testing**

- Black-box: Does not look at internal code; tests functionality through inputs and outputs. Representative technique: Equivalence Partitioning. Advantage: simulates the user's perspective. Disadvantage: cannot cover all internal code paths.
- White-box: Based on internal code logic. Representative technique: Branch Coverage. Advantage: can target specific code paths. Disadvantage: may miss functional-level requirements issues.

**Q62. Stub vs Driver**

- Stub: Simulates a **called (lower-level)** module. Used in **top-down** integration testing.
- Driver: Simulates a **calling (upper-level)** module. Used in **bottom-up** integration testing.
- Memory aid: **S**tub → **S**ubordinate; **D**river → **D**irector.

**Q63. Regression Testing**

- Definition: Re-running existing test cases after code changes to ensure that new modifications have not broken existing functionality.
- Importance: Software modules are interdependent. A change in one place can unexpectedly affect other modules. Without regression testing, there is a high risk of "fixing one bug and introducing three more."
- Automation: Regression tests are typically automated via CI pipelines that run unit / integration test suites on every code commit.

**Q64. Four Activities of Configuration Management**

- Configuration Identification: Determine which software elements are Configuration Items (CIs) and assign unique identifiers.
- Configuration Control: Manage changes — submit CR → impact analysis → CCB review → approve / reject → implement → verify → update baseline.
- Configuration Status Accounting: Record and report each CI's current status and change history.
- Configuration Auditing: Verify that the actual product matches the configuration records (ensuring "what is said = what is done").

**Q65. Brooks' Law**

- Content: "Adding manpower to a late software project makes it later."
- Three reasons: (1) **New people need ramp-up time** (learning the architecture, tech stack, business logic) — they consume senior team members' time for mentoring without contributing immediately. (2) **Communication costs grow nonlinearly**: n people create n(n-1)/2 communication channels. (3) **Many tasks are indivisible** — they cannot be parallelized by adding people.
- Conclusion: Person-months are not interchangeable commodities. Adding people does not equal acceleration.

### Part 5: Comprehensive Application Key Points

**Q66. Process Model and Architecture Selection**

1. **Recommended process model**: **Incremental model** or **RUP**
   - Reason 1: Core functions (appointments, diagnosis, medication) are relatively clear and can be delivered in increments — core features first, then external system integration.
   - Reason 2: Future integration with external systems (health insurance) means requirements will evolve — incremental models handle change well.
   - RUP is also valid: Inception for scope, Elaboration for architecture, Construction for incremental building.

2. **Recommended architecture**: **Layered Architecture + MVC**
   - Layered Architecture (Presentation → Business Logic → Data Access): Supports high security (each layer can enforce its own security policies) and makes future external system integration easy (via interface layer).
   - MVC (within the presentation layer): Separates view and control logic, supports different clients (PC, mobile).

3. **Apply OCP (Open / Closed Principle)** + **DIP (Dependency Inversion Principle)**
   - Define a `PaymentGateway` interface (abstraction).
   - The health insurance system implements that interface.
   - When integrating a new system in the future, only a new implementation class is added — no existing code is modified.
   - This satisfies OCP (open for extension) and DIP (depend on abstractions).

**Q67. UML Comprehensive Modeling**

1. **Use Case Diagram** (text description):
   - Actors: **Organizer**, **Student**, **Admin**
   - Organizer use cases: Publish Event, Publish Event Summary
   - Student use cases: Browse Events, Register for Event, Write Review
   - Admin use cases: Review Events, Manage Users, Freeze Account
   - "Register for Event" `<<include>>` "Browse Events" (must browse first to select one)

2. **Class Diagram** (text description):
   ```
   Organizer [1] —————————— [0..*] Event      (Association: one organizer publishes zero or more events)
   Student   [1] —————————— [0..*] Review      (Association: one student writes zero or more reviews)
   Student   [1] ◇—————— [0..*] Registration  (Aggregation: deleting student does NOT cascade to registration records)
   Event     [1] ———————— [0..*] Registration  (Association: one event has zero or more registrations)
   Event     [1] ———————— [0..1] Summary       (Association: one event has zero or one summary)
   Event     [1] ———————— [0..*] Review         (Association: one event has zero or more reviews)

   Class structures:
   Organizer: -name, -contact
   Student: -studentId, -name, -email
   Event: -eventName, -time, -location, -maxCapacity, -status
   Registration: -registrationId, -registrationDate, -status
   Summary: -content, -publishDate
   Review: -content, -rating, -createDate
   Admin: -adminId, -name
   ```

3. **Sequence Diagram** ("Student registers for Event"):
   ```
   1. Student          → UI_Interface          : clickEvent(eventId)
   2. UI_Interface     → RegistrationController : register(studentId, eventId)
   3. RegistrationController → Event            : checkCapacity(eventId)
   4. Event            → RegistrationController : return (currentCount < maxCapacity)
   5. alt [capacity available]
      5.1 RegistrationController → Registration   : create(studentId, eventId)
      5.2 Registration → RegistrationController   : success
      5.3 RegistrationController → Event          : incrementCount()
      5.4 RegistrationController → UI_Interface   : displaySuccess
   6. else [capacity full]
      6.1 RegistrationController → UI_Interface   : displayError("Event is full")
   7. UI_Interface → Student : show result
   ```

**Q68. Testing Design**

1. **Username Equivalence Classes**:

   | Class | Description | Example |
   |-------|-------------|---------|
   | Valid class 1 | 6-20 chars, letters/digits only, not starting with digit | "userABC123" |
   | Invalid class 1 | Length < 6 | "ab12" |
   | Invalid class 2 | Length > 20 | "abcdefghijklmnopqrstuvwxyz123" |
   | Invalid class 3 | Starts with a digit | "1user" |
   | Invalid class 4 | Contains illegal characters (e.g., symbols) | "user@name" |
   | Invalid class 5 | Empty string or null | "" or null |

2. **Username Boundary Value Analysis**:

   | Boundary | Value | Expected |
   |----------|-------|----------|
   | Min length - 1 | 5 letters | Invalid |
   | Min length | 6 letters | Valid |
   | Min length + 1 | 7 letters | Valid |
   | Max length - 1 | 19 letters | Valid |
   | Max length | 20 letters | Valid |
   | Max length + 1 | 21 letters | Invalid |

   Plus the "first character" boundary:
   | First char boundary | "a1user" | Valid (starts with a letter) |
   | First char boundary | "1auser" | Invalid (starts with a digit) |

3. **Cyclomatic Complexity**:
   - Decision nodes: `if (username == null)`, `if (len < 6 || len > 20)`, `if (Character.isDigit(username.charAt(0)))`, `if (!Character.isLetterOrDigit(c))`
   - Note: `len < 6 || len > 20` is ONE decision node (with two sub-conditions)
   - Number of decision nodes = 4
   - CC = 4 + 1 = **5**
   - Meaning: at least 5 test cases are needed to cover all possible execution paths

4. **Branch coverage minimum**:
   - 4 if statements, each with true / false branches → 8 branches total
   - However, some branches are mutually exclusive (e.g., if the first if is true, the rest are skipped)
   - Minimum **5 test cases** needed for 100% branch coverage
   - Example set: null (first if true), "ab1" (second if true), "1user" (third if true), "user@name" (fourth if true), "userABC123" (all false)

**Q69. Configuration Management and Cost Estimation**

1. **COCOMO Calculation**:

   Effort = a × (KLOC)^b = 3.0 × (50)^1.12
   - log₁₀(50) ≈ 1.699
   - 1.12 × 1.699 ≈ 1.903
   - 50^1.12 = 10^1.903 ≈ 80.0
   - Effort ≈ 3.0 × 80.0 = **240 person-months**

   Time = c × (Effort)^d = 2.5 × (240)^0.35
   - log₁₀(240) ≈ 2.38
   - 0.35 × 2.38 ≈ 0.833
   - 240^0.35 = 10^0.833 ≈ 6.81
   - Time ≈ 2.5 × 6.81 ≈ **17.0 months**

   Staff = Effort / Time = 240 / 17.0 ≈ **14.1 people**

   Current team has only 6 people, far fewer.

2. **Brooks' Law Analysis**:
   - Adding 3 people (to 9 total) is still far short of 14, AND the short-term effect is **negative**
   - New team members need ramp-up time (learning the architecture, tech stack, business logic), consuming senior members' time for mentoring without contributing
   - Communication channels jump from 6×5/2=15 to 9×8/2=36 — more than double
   - Recommendation: accept the reality of delay; consider alternatives like scope reduction or extending the timeline rather than adding people

3. **Git branch strategy**:
   - Git is a **distributed** version control system
   - Recommended strategy: **GitFlow**
   - Reasons:
     - The project is relatively large (50 KLOC), suitable for formal branch management
     - Clear feature development and release cycles
     - master (production), develop (integration), feature (feature development), release (release preparation), hotfix (emergency fixes) each serve a specific purpose
     - Supports parallel development and version management by multiple developers

*Test complete! Use the score table below to assess your level, and review the corresponding lectures for any incorrect answers.*

| Score Range | Rating | Recommendation |
|-------------|--------|----------------|
| 180-200 | Excellent | Ready for the exam |
| 140-179 | Good | Review weak spots only |
| 100-139 | Passing | Focus on incorrect answers by lecture |
| < 100 | Needs work | Re-read the review document thoroughly |

*声明：测试题题目和答案由 Claude Code 根据课程课件准备*