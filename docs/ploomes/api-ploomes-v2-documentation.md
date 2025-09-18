# API ploomes v2

- Baseado em: <https://www.postman.com/aviation-geoscientist-90331629/my-workspace/collection/9c2d4ui/api-ploomes-v2?tab=onboarding>

**Collection ID:** b1811579-2a5e-4f01-8cfd-694a97301424

## Resumo

- **Total de grupos:** 47
- **Total de endpoints:** 283

## Índice

1. [Account](#account) (13 endpoints)
2. [Approvals](#approvals) (1 endpoints)
3. [Attachments](#attachments) (1 endpoints)
4. [Automations](#automations) (6 endpoints)
5. [Bulk Procedures](#bulk-procedures) (4 endpoints)
6. [Business Rules](#business-rules) (6 endpoints)
7. [Checklists](#checklists) (4 endpoints)
8. [Cities](#cities) (4 endpoints)
9. [Comments](#comments) (4 endpoints)
10. [Contacts](#contacts) (19 endpoints)
11. [Images](#images) (3 endpoints)
12. [Currencies](#currencies) (1 endpoints)
13. [Deals](#deals) (20 endpoints)
14. [Departments](#departments) (2 endpoints)
15. [Document Templates](#document-templates) (8 endpoints)
16. [Emails](#emails) (11 endpoints)
17. [Fields](#fields) (14 endpoints)
18. [Filters](#filters) (4 endpoints)
19. [Forms](#forms) (12 endpoints)
20. [GeneralSearch](#generalsearch) (1 endpoints)
21. [Importations](#importations) (4 endpoints)
22. [Importation Templates](#importation-templates) (2 endpoints)
23. [Interaction Records](#interaction-records) (6 endpoints)
24. [Leads](#leads) (13 endpoints)
25. [Messages](#messages) (5 endpoints)
26. [Notifications](#notifications) (3 endpoints)
27. [Operations](#operations) (1 endpoints)
28. [Orders](#orders) (12 endpoints)
29. [Panels](#panels) (11 endpoints)
30. [Phone Types](#phone-types) (1 endpoints)
31. [Products](#products) (17 endpoints)
32. [Public](#public) (2 endpoints)
33. [Quotes](#quotes) (9 endpoints)
34. [Relative Dates](#relative-dates) (1 endpoints)
35. [Roles](#roles) (2 endpoints)
36. [Selectors](#selectors) (1 endpoints)
37. [Self](#self) (13 endpoints)
38. [Tables](#tables) (4 endpoints)
39. [Tags](#tags) (5 endpoints)
40. [Tasks](#tasks) (9 endpoints)
41. [Teams](#teams) (4 endpoints)
42. [Timeline](#timeline) (2 endpoints)
43. [Users](#users) (13 endpoints)
44. [Webhooks](#webhooks) (5 endpoints)
45. [Expand](#expand) (0 endpoints)
46. [Batch](#batch) (0 endpoints)
47. [Find in array](#find-in-array) (0 endpoints)

---

## Account

*13 endpoints*

### Account (GET)

**Method:** `GET`

**URL:** `{{server}}Account@Integrations?$expand=Integration($expand=Fields)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Integration($expand=Fields) |

---

### Account (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Account(0)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Empresa"
}
```

---

### UploadLogo (POST)

**Method:** `POST`

**URL:** `{{server}}Account/UploadLogo`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/x-www-form-urlencoded |
| User-Key | {{uk}} |

---

### Payments (GET)

**Method:** `GET`

**URL:** `{{server}}Account@Payments?$expand=Method,Service`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Method,Service |

---

### Payments@Methods (GET)

**Method:** `GET`

**URL:** `{{server}}Account@Payments@Methods`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Plans (GET)

**Method:** `GET`

**URL:** `{{server}}Account@Plans`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### CancelReasons (GET)

**Method:** `GET`

**URL:** `{{server}}Account@CancelReasons`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Cancel (POST)

**Method:** `POST`

**URL:** `{{server}}Account/Cancel`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Reasons": [
    {
      "ReasonId": 7,
      "Comments": "Nada"
    }
  ]
}
```

---

### RDStationIntegration@Behaviors (GET)

**Method:** `GET`

**URL:** `{{server}}Account@RDStationIntegration@Behaviors`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### ReevIntegration@Behaviors (GET)

**Method:** `GET`

**URL:** `{{server}}Account@ReevIntegration@Behaviors`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### MailChimpIntegration (GET)

**Method:** `GET`

**URL:** `{{server}}Account@MailChimpIntegration`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### MailChimpIntegration (POST)

**Method:** `POST`

**URL:** `{{server}}Account@MailChimpIntegration`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "TemporaryToken": "X",
  "RedirectUri": "https://new.ploomes.com"
}
```

---

### MailChimpIntegration (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Account@MailChimpIntegration`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Approvals

*1 endpoints*

### Approvals (GET)

**Method:** `GET`

**URL:** `{{server}}Approvals`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Attachments

*1 endpoints*

### Attachments (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Attachments(29334)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Automations

*6 endpoints*

### Automations (GET)

**Method:** `GET`

**URL:** `{{server}}Automations?$expand=Actions`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Actions |

---

### Automations (POST)

**Method:** `POST`

**URL:** `{{server}}Automations`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "TriggerId": 1,
  "TriggerDealStageId": 249,
  "Actions": [
    {
      "ActionId": 1,
      "FieldKey": "deal_amount",
      "DecimalValue": 10000
    },
    {
      "ActionId": 2,
      "DealStageId": 250
    }
  ],
  "Ordination": 0
}
```

---

### Automations (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Automations(1)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "TriggerFilterId": 401,
  "Actions": [
    {
      "ActionId": 1,
      "FieldKey": "deal_amount",
      "DecimalValue": 10000
    },
    {
      "ActionId": 2,
      "DealStageId": 250
    },
    {
      "ActionId": 4,
      "EmailTemplateId": 39
    }
  ]
}
```

---

### Automations (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Automations(2)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Triggers (GET)

**Method:** `GET`

**URL:** `{{server}}Automations@Triggers`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Actions@Actions (GET)

**Method:** `GET`

**URL:** `{{server}}Automations@Actions@Actions`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Bulk Procedures

*4 endpoints*

### BulkProcedures (GET)

**Method:** `GET`

**URL:** `{{server}}BulkProcedures`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### BulkProcedures (POST)

**Method:** `POST`

**URL:** `{{server}}BulkProcedures`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "EntityId": 1,
  "FilterUrl": "{{server}}Contacts?$filter=Name+eq+'Ploomes3'",
  "RequestBody": {
    "Name": "Ploomes4"
  }
}
```

---

### Actions (GET)

**Method:** `GET`

**URL:** `{{server}}BulkProcedures@Actions`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### GetProgress (GET)

**Method:** `GET`

**URL:** `{{server}}BulkProcedures(59)/GetProgress`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Business Rules

*6 endpoints*

### BusinessRules (GET)

**Method:** `GET`

**URL:** `{{server}}BusinessRules?$expand=Fields`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Fields |

---

### BusinessRules (POST)

**Method:** `POST`

**URL:** `{{server}}BusinessRules?$expand=Fields,ApprovalLevels($expand=Users)`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Fields,ApprovalLevels($expand=Users) |

**Request Body:**
```json
{
  "Name": "Regra",
  "ActionId": 2,
  "Fields": [
    {
      "FieldKey": "contact_name",
      "StringValue": "Nome do cliente",
      "OperationId": 1
    }
  ],
  "ApprovalLevels": [
    {
      "Ordination": 10,
      "Users": [
        {
          "UserId": 116
        }
      ]
    }
  ]
}
```

---

### BusinessRules (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}BusinessRules(725)?$expand=Fields,ApprovalLevels($expand=Users)`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Fields,ApprovalLevels($expand=Users) |

**Request Body:**
```json
{
  "Name": "Regra",
  "ActionId": 2,
  "Fields": [
    {
      "FieldKey": "contact_name",
      "OperationId": 1,
      "StringValue": "Nome do cliente"
    }
  ],
  "ApprovalLevels": [
    {
      "Id": 1327,
      "Ordination": 10,
      "Users": [
        {
          "UserId": 116
        }
      ]
    }
  ]
}
```

---

### BusinessRules (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}BusinessRules(722)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Actions (GET)

**Method:** `GET`

**URL:** `{{server}}BusinessRules@Actions`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### ValidateQuote (POST)

**Method:** `POST`

**URL:** `{{server}}BusinessRules/ValidateQuote?$expand=BusinessRule`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | BusinessRule |

**Request Body:**
```json
{
  "Deal": {
    "Title": "Oba",
    "ContactId": 3017
  },
  "TemplateId": 71,
  "Sections": [
    {
      "Products": [
        {
          "ProductId": 414,
          "CurrencyId": 1,
          "Total": 10000,
          "Parts": [
            {
              "ProductId": 414,
              "CurrencyId": 1,
              "Total": 10000
            }
          ],
          "OtherProperties": [
            {
              "FieldKey": "quote_table_product_inteirinho",
              "IntegerValue": 5
            }
          ]
        }
      ],
      "Code": 1,
      "CurrencyId": 1,
      "Total": 1000
    }
  ],
  "CurrencyId": 1,
  "Amount": 1000
}
```

---

## Checklists

*4 endpoints*

### Checklists (GET)

**Method:** `GET`

**URL:** `{{server}}Checklists?select=*`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Fields($expand=Users) |
| select | * |

---

### Checklists (POST)

**Method:** `POST`

**URL:** `{{server}}Checklists`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Meu checklist",
  "DealStageId": 249,
  "Fields": [
    {
      "FieldKey": "deal_textao",
      "Required": true,
      "Users": [
        {
          "UserId": 116
        }
      ]
    }
  ]
}
```

---

### Checklists (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Checklists(1)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Meu checklist",
  "DealStageId": 249,
  "Fields": [
    {
      "FieldKey": "deal_textao",
      "Required": true,
      "Users": [
        {
          "UserId": 116
        }
      ]
    }
  ]
}
```

---

### Checklists (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Checklists(1)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Cities

*4 endpoints*

### Cities (GET)

**Method:** `GET`

**URL:** `{{server}}Cities?$top=20&$expand=Country,State`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 20 |
| $expand | Country,State |

---

### CIties (POST)

**Method:** `POST`

**URL:** `{{server}}Cities`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Cidade Longe",
  "StateId": 25,
  "CountryId": 76
}
```

---

### Countries (GET)

**Method:** `GET`

**URL:** `{{server}}Cities@Countries?$expand=States`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | States |

---

### Countries@States (GET)

**Method:** `GET`

**URL:** `{{server}}Cities@Countries@States?$filter=CountryId eq 76`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $filter | CountryId eq 76 |

---

## Comments

*4 endpoints*

### Comments (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Comments(7803)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "apressado"
}
```

---

### Comments (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Comments(7803)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### ExternalComments (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}ExternalComments(6447)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "pp"
}
```

---

### ExternalComments (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}ExternalComments(6448)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Contacts

*19 endpoints*

### Contacts (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Contacts@Products (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Contacts (POST)

**Method:** `POST`

**URL:** `{{server}}Contacts?$expand=Phones`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Phones |

**Request Body:**
```json
{
  "Name": "Vinicius Teste",
  "TypeId": 2,
  "Phones": [
    {
      "PhoneNumber": "(11) 3842-6671",
      "TypeId": 1,
      "CountryId": 76
    }
  ]
}
```

---

### Contacts (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Contacts(1785)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Facebook": "proinox"
}
```

---

### Contacts (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Contacts(3032)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Classes (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts@Classes`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### LinesOfBusiness (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts@LinesOfBusiness`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### LinesOfBusiness (POST)

**Method:** `POST`

**URL:** `{{server}}Contacts@LinesOfBusiness`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Papelaria"
}
```

---

### NumbersOfEmployees (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts@NumbersOfEmployees`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### NumbersOfEmployees (POST)

**Method:** `POST`

**URL:** `{{server}}Contacts@NumbersOfEmployees`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "1 a 5"
}
```

---

### Origins (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts@Origins`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Origins (POST)

**Method:** `POST`

**URL:** `{{server}}Contacts@Origins`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Original"
}
```

---

### Status (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts@Status`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Types (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts@Types`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Relationships (GET)

**Method:** `GET`

**URL:** `{{server}}Contacts@Relationships`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Imports (POST)

**Method:** `POST`

**URL:** `{{server}}Contacts@Imports`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "CreateQuantity": 200,
  "UpdateQuantity": 300
}
```

---

### UpdateOtherProperty (POST)

**Method:** `POST`

**URL:** `{{server}}Contacts(2720)/UpdateOtherProperty?$expand=OtherProperties`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | OtherProperties |

**Request Body:**
```json
{
  "FieldKey": "contact_campo_cliente",
  "Values": [
    {
      "DecimalValue": 10000
    }
  ]
}
```

---

### UploadFile (POST)

**Method:** `POST`

**URL:** `{{server}}Contacts(2720)/UploadFile?$expand=Attachments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Attachments |

---

### IsDuplicate (POST)

**Method:** `POST`

**URL:** `{{server}}Contacts/IsDuplicate`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Marquinhos alberto"
}
```

---

## Images

*3 endpoints*

### Images (GET)

**Method:** `GET`

**URL:** `{{server}}Images`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Images (POST)

**Method:** `POST`

**URL:** `{{server}}Images`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Images (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Images(18069)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Currencies

*1 endpoints*

### Currencies (GET)

**Method:** `GET`

**URL:** `{{server}}Currencies`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Deals

*20 endpoints*

### Deals (GET)

**Method:** `GET`

**URL:** `{{server}}Deals?$filter=Id eq 1078863`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $select | Amount |
| $filter | Id eq 1078863 |

---

### GetDeletedDeals (GET)

**Method:** `GET`

**URL:** `{{server}}Deals/GetDeletedDeals?$filter=LastUpdateDate ge 2019-05-01T00:00:00-03:00`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $filter | LastUpdateDate ge 2019-05-01T00:00:00-03:00 |

---

### Deals (POST)

**Method:** `POST`

**URL:** `{{server}}Deals`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Title": "Oba",
  "ContactId": 1774
}
```

---

### Deals (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Deals(131)?$expand=Stages,Tags,Products,Contacts,OtherProperties`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Stages,Tags,Products,Contacts,OtherProperties |

**Request Body:**
```json
{
  "OwnerId": 116
}
```

---

### Deals (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Deals(107)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Win (POST)

**Method:** `POST`

**URL:** `{{server}}Deals(2516706)/Win`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{}
```

---

### Lose (POST)

**Method:** `POST`

**URL:** `{{server}}Deals(131)/Lose?$expand=Stages`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Stages |

**Request Body:**
```json
{
  "LossReasonId": 176
}
```

---

### Reopen (POST)

**Method:** `POST`

**URL:** `{{server}}Deals(96)/Reopen?$expand=Stages`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Stages |

---

### MarkAsRead (POST)

**Method:** `POST`

**URL:** `{{server}}Deals(294215)/MarkAsRead`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Read": true
}
```

---

### ValidateChecklist (GET)

**Method:** `GET`

**URL:** `{{server}}Deals(41041)/ValidateChecklist`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

### Pipelines (GET)

**Method:** `GET`

**URL:** `{{server}}Deals@Pipelines?$expand=Tables,Stages,AllowedUsers,AllowedTeams`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Tables,Stages,AllowedUsers,AllowedTeams |

---

### Pipelines (POST)

**Method:** `POST`

**URL:** `{{server}}Deals@Pipelines?$expand=Stages`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Stages |

**Request Body:**
```json
{
  "Name": "Funil inserido pelo Postman",
  "MayCreateQuotes": true,
  "Stages": [
    {
      "Name": "Estágio 1",
      "Ordination": 1
    },
    {
      "Name": "Estágio 2",
      "Ordination": 2
    }
  ]
}
```

---

### Pipelines (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Deals@Pipelines(57)?$expand=Stages,AllowedUsers,AllowedTeams,Tables`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Stages,AllowedUsers,AllowedTeams,Tables |

**Request Body:**
```json
{
  "Name": "Funil",
  "MayCreateQuotes": true,
  "Stages": [
    {
      "Id": 249,
      "Name": "Primeiros Contatos",
      "Ordination": 1
    },
    {
      "Id": 250,
      "Name": "Proposta Enviada",
      "Ordination": 2
    },
    {
      "Id": 251,
      "Name": "Fechamento",
      "Ordination": 3
    }
  ],
  "Tables": [
    {
      "TableId": 1
    }
  ]
}
```

---

### Pipelines (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Deals@Pipelines(2974)?$expand=Stages,AllowedUsers,AllowedTeams`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Stages,AllowedUsers,AllowedTeams |

**Request Body:**
```json
{
  "ReplacementId": 57
}
```

---

### Stages (GET)

**Method:** `GET`

**URL:** `{{server}}Deals@Stages`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Status (GET)

**Method:** `GET`

**URL:** `{{server}}Deals@Status`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### LossReasons (GET)

**Method:** `GET`

**URL:** `{{server}}Deals@LossReasons`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### UploadFile (POST)

**Method:** `POST`

**URL:** `{{server}}Deals(96)/UploadFile?$expand=Attachments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Attachments |

---

### NewExternalComment (POST)

**Method:** `POST`

**URL:** `{{server}}Deals(17)/NewExternalComment`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "comentariozin"
}
```

---

### GetAmountSumByCurrencySymbol (GET)

**Method:** `GET`

**URL:** `{{server}}CurrencyCurrency`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Departments

*2 endpoints*

### Departments (GET)

**Method:** `GET`

**URL:** `{{server}}Departments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Departments (POST)

**Method:** `POST`

**URL:** `{{server}}Departments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Depart"
}
```

---

## Document Templates

*8 endpoints*

### DocumentTemplates (GET)

**Method:** `GET`

**URL:** `{{server}}DocumentTemplates?$filter=EntityId+eq+7`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $filter | EntityId+eq+7 |

---

### DocumentTemplates (POST)

**Method:** `POST`

**URL:** `{{server}}DocumentTemplates`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "EntityId": 4,
  "BodySourceCode": "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:758px\"> <tbody> <tr> <td style=\"padding-bottom: 10px; width: 385px; border-top-color: rgb(255, 255, 255); border-right-color: rgb(255, 255, 255); border-left-color: rgb(255, 255, 255); border-bottom: 2px solid #aaa;\"><span style=\"font-size:0.875em\"><span style=\"color:#808080\"><field key=\"order_date\" format=\"dd/MM/yyyy\">[Venda.Data]</field></span></span></td> <td style=\"padding-bottom: 10px; text-align: right; width: 370px; border-top-color: rgb(255, 255, 255); border-right-color: rgb(255, 255, 255); border-left-color: rgb(255, 255, 255); border-bottom: 2px solid #aaa;\"><font color=\"#808080\"><span style=\"font-size:11.375px\">Venda&nbsp;</span></font><span style=\"font-size:1.000em\"><strong><field key=\"order_number\">[Venda.N&uacute;mero]</field></strong></span>&nbsp;</td> </tr> </tbody> </table> <div style=\"height: 5px\">&nbsp;</div> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:758px\"> <tbody> <tr> <td style=\"width: 114px; vertical-align: middle; border-color: white;\"> <div style=\"border: 1px solid #aaa; display: inline-block; line-height: 0; height: 98px; width: 98px;\"><img alt=\"\" field-key=\"account_logo_url\" src=\"https://ploomescrm.s3-sa-east-1.amazonaws.com/default_company_logo.png\" width=\"98\" /></div> </td> <td style=\"width: 641px; vertical-align: top; border-color: white;\"> <p><span style=\"font-size:1.000em\"><strong><field key=\"account_name\">[Sua Empresa.Nome]</field></strong></span></p> <div style=\"display: block;\"><span style=\"font-size:0.875em\"><field key=\"account_phone\">[Sua Empresa.Telefone]</field></span></div> <div style=\"display: block;\"><span style=\"font-size:0.875em\"><field key=\"account_email\">[Sua Empresa.E-mail]</field></span></div> <div style=\"display: block;\"><span style=\"font-size:0.875em\"><field key=\"account_street_address\">[Sua Empresa.Endere&ccedil;o]</field></span></div> <div style=\"display: block;\"><span style=\"font-size:0.875em\"><field key=\"account_website\">[Sua Empresa.Website]</field></span></div> </td> </tr> </tbody> </table> <div style=\"height: 5px\">&nbsp;</div> <div style=\"border-bottom: 2px solid #aaa; height: 2px;\">&nbsp;</div> <div style=\"height: 5px\">&nbsp;</div> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:758px\"> <tbody> <tr> <td style=\"width: 482px; border-color: white;\"> <p><span style=\"font-size:1.000em\"><strong>Cliente:&nbsp;<field key=\"contact_legal_name\">[Cliente.Raz&atilde;o social]</field></strong></span></p> <div style=\"display:block;\"><field key=\"contact_cnpj\">[Cliente.CPF / CNPJ]</field></div> <div style=\"display:block;\"><field key=\"contact_street_address\">[Cliente.Endere&ccedil;o]</field>,&nbsp;<field key=\"contact_neighborhood\">[Cliente.Bairro]</field></div> <div style=\"display:block;\"><field key=\"city_name\">[Cliente.Cidade]</field>&nbsp;-&nbsp;<field key=\"state_short\">[Cliente.UF]</field></div> <div style=\"display:block;\"><field key=\"contact_zipcode\" format=\"00000-000\">[Cliente.CEP]</field></div> </td> </tr> </tbody> </table> <div style=\"height: 5px\">&nbsp;</div> <div style=\"border-bottom: 2px solid #aaa; height: 2px;\">&nbsp;</div> <div style=\"height: 5px\">&nbsp;</div> <div style=\"font-size:0.875em\"> <p>&nbsp;</p> </div> <table section-code=\"0\" section-name=\"Lista de produtos/serviços\" border=\"1\" cellpadding=\"4\" cellspacing=\"0\" style=\"border-color:#aaa; width:758px\"> <tbody> <tr style=\"background-color: rgb(238, 238, 238); border-color: #aaa\"> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-left-color: rgb(170, 170, 170); border-right: 0px; break-inside: avoid; width: 43px;\"><span style=\"font-size:0.875em\">Item</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-right: 0px; border-left: 0px; break-inside: avoid; width: 123px; text-align: left;\"><span style=\"font-size:0.875em\">Grupo</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-right: 0px; border-left: 0px; break-inside: avoid; width: 140px; text-align: left;\"><span style=\"font-size:0.875em\">Produto/Servi&ccedil;o</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-right: 0px; border-left: 0px; break-inside: avoid; width: 61px; text-align: left;\"><span style=\"font-size:0.875em\">Qtd.</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-right: 0px; border-left: 0px; break-inside: avoid; width: 99px; text-align: left;\"><span style=\"font-size:0.875em\">Valor unit&aacute;rio</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-right-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-left: 0px; break-inside: avoid; width: 108px; text-align: left;\"><span style=\"font-size:0.875em\">Desconto</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-right-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-left: 0px; break-inside: avoid; width: 125px; text-align: right;\"><span style=\"font-size:0.875em\">Total</span></th> </tr> <tr products=\"true\"> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 43px; text-align: center;\"><span style=\"font-size:0.875em\"><product-index>1</product-index></span></td> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 122px;\"><span style=\"font-size:0.875em\"><field key=\"product_group_name\">[Grupo do Produto.Nome]</field></span></td> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 139px;\"><span style=\"font-size:0.875em\"><field key=\"product_name\">[Produto.Nome]</field></span></td> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 60px;\"><span style=\"font-size:0.875em\"><field key=\"order_product_quantity\">[Produto.Quantidade]</field></span></td> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 98px;\"><span style=\"font-size:0.875em\"><field key=\"currency_symbol\">[Produto.Moeda]</field>&nbsp;<field key=\"order_product_unit_price\" format=\"n2\">[Produto.Valor unit&aacute;rio]</field></span></td> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 107px;\"><condition field-key=\"order_product_discount\" operation=\">\" value=\"0\"><span style=\"font-size:0.875em\"><field key=\"order_product_discount\" format=\"n1\">[Produto.Desconto]</field>%</span></condition></td> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 125px; text-align: right;\"><span style=\"font-size:0.875em\"><field key=\"currency_symbol\">[Produto.Moeda]</field>&nbsp;<field key=\"order_product_total\" format=\"n2\">[Produto.Total]</field></span></td> </tr> <condition field-key=\"order_discount\" operation=\">\" value=\"0\"> <tr style=\"background-color: rgb(238, 238, 238)\"> <td colspan=\"6\" rowspan=\"1\" style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 614px; text-align: right;\"><span style=\"font-size:0.875em\">Desconto:</span></td> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 125px; text-align: right;\"><span style=\"font-size:0.875em\"><field key=\"order_discount\" format=\"n1\">[Venda.Desconto]</field>%</span></td> </tr> </condition> <tr style=\"background-color: rgb(238, 238, 238)\"> <td colspan=\"6\" rowspan=\"1\" style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 614px; text-align: right;\"><span style=\"font-size:0.875em\"><strong>Total:</strong></span></td> <td style=\"border-color: rgb(170, 170, 170); break-inside: avoid; width: 125px; text-align: right;\"><span style=\"font-size:0.875em\"><strong><field key=\"currency_symbol\">[Venda.Moeda]</field>&nbsp;<field key=\"order_amount\" format=\"n2\">[Venda.Valor]</field></strong></span></td> </tr> <tr><td colspan=\"7\"><field key=\"quote_section_885E1DCA-6ABD-4FD7-A934-7EF396C67975\" format=\"dd/MMM/yyyy\">Data ale</field></td></tr> </tbody> </table> <p>&nbsp;</p> <p><span style=\"font-size:0.875em\"><strong>Informa&ccedil;&otilde;es da venda</strong></span></p> <p><span style=\"font-size:0.875em\"><field key=\"order_description\">[Venda.Informa&ccedil;&otilde;es]</field></span></p> <p>&nbsp;</p> <div style=\"height: 5px\">&nbsp;</div> <div style=\"border-bottom: 2px solid #aaa; height: 2px;\">&nbsp;</div> <div style=\"height: 5px\">&nbsp;</div> <p><span style=\"font-size:0.875em\"><strong>Respons&aacute;vel</strong></span></p> <div style=\"font-size:0.875em\"> <p><span><field key=\"user_name\">[Respons&aacute;vel.Nome]</field></span></p> <p><span><field key=\"user_email\">[Respons&aacute;vel.E-mail]</field></span></p> <p><span><field key=\"user_phone\">[Respons&aacute;vel.Telefone]</field></span></p> </div>"
}
```

---

### DocumentTemplates (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}DocumentTemplates(44132)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Pages": [
    {
      "HeaderSourceCode": "<img alt=\"\" height=\"150\" src=\"http://ploomescrm.s3-sa-east-1.amazonaws.com/13E57D484A78/Imagem/03675822c49e4ee3bd3820637c9abecf.jpg\" width=\"200\" />",
      "HeaderHeight": 0,
      "FooterSourceCode": "",
      "FooterHeight": 0,
      "BodySourceCode": "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:758px\"> <tbody> <tr> <td style=\"border-bottom:2px solid #aaaaaa; border-left-color:#ffffff; border-right-color:#ffffff; border-top-color:#ffffff; padding-bottom:10px; width:385px\"><span style=\"font-size:0.875em\"><span style=\"color:#808080\"><field format=\"dd/MM/yyyy\" key=\"order_date\">[Venda.Data]</field></span></span></td> <td style=\"border-bottom:2px solid #aaaaaa; border-left-color:#ffffff; border-right-color:#ffffff; border-top-color:#ffffff; padding-bottom:10px; text-align:right; width:370px\"><span style=\"color:#808080\"><span style=\"font-size:11.375px\">Venda&nbsp;</span></span><span style=\"font-size:1.000em\"><strong><field class=\"h-card\" key=\"order_number\">[Venda.Número]</field></strong></span>&nbsp;</td> </tr> </tbody> </table> <div style=\"height:5px\">&nbsp;</div> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:758px\"> <tbody> <tr> <td style=\"border-color:white; vertical-align:middle; width:114px\"> <div style=\"border:1px solid #aaaaaa; display:inline-block; height:98px; line-height:0; width:98px\"><img alt=\"\" field-key=\"account_logo_url\" src=\"https://ploomescrm.s3-sa-east-1.amazonaws.com/default_company_logo.png\" width=\"98\" /></div> </td> <td style=\"border-color:white; vertical-align:top; width:641px\"> <p><span style=\"font-size:1.000em\"><strong><field class=\"h-card\" key=\"account_name\">[Sua Empresa.Nome]</field></strong></span></p> <div style=\"display:block\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"account_phone\">[Sua Empresa.Telefone]</field></span></div> <div style=\"display:block\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"account_email\">[Sua Empresa.E-mail]</field></span></div> <div style=\"display:block\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"account_street_address\">[Sua Empresa.Endereço]</field></span></div> <div style=\"display:block\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"account_website\">[Sua Empresa.Website]</field></span></div> </td> </tr> </tbody> </table> <div style=\"height:5px\">&nbsp;</div> <div style=\"border-bottom:2px solid #aaaaaa; height:2px\">&nbsp;</div> <div style=\"height:5px\">&nbsp;</div> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:758px\"> <tbody> <tr> <td style=\"border-color:white; width:482px\"> <p><span style=\"font-size:1.000em\"><strong>Cliente:&nbsp;<field class=\"h-card\" key=\"contact_name\">[Cliente.Nome]</field></strong></span></p> <div style=\"display:block\"><field class=\"h-card\" key=\"contact_cnpj\">[Cliente.CPF / CNPJ]</field></div> <div style=\"display:block\"><field class=\"h-card\" key=\"contact_street_address\">[Cliente.Endereço]</field></div> <div style=\"display:block\"><field class=\"h-card\" key=\"contact_neighborhood\">[Cliente.Bairro]</field></div> <div style=\"display:block\"><field class=\"h-card\" key=\"city_name\">[Cliente.Cidade]</field>&nbsp;<field class=\"h-card\" key=\"state_short\">[Cliente.UF]</field></div> <div style=\"display:block\"><field class=\"h-card\" format=\"00000-000\" key=\"contact_zipcode\">[Cliente.CEP]</field></div> <div style=\"display:block\"><field key=\"contact_phones\" path-id=\"47\">[Negócio / Contato.Telefones]</field></div> </td> </tr> </tbody> </table> <div style=\"height:5px\">&nbsp;</div> <div style=\"border-bottom:2px solid #aaaaaa; height:2px\">&nbsp;</div> <div style=\"height:5px\">&nbsp;</div> <div style=\"font-size:0.875em\"> <p>&nbsp;</p> </div> <table border=\"1\" cellpadding=\"4\" cellspacing=\"0\" section-code=\"0\" section-name=\"Lista de produtos/serviços\" style=\"border-color:#aaaaaa; width:758px\"> <tbody> <tr style=\"background-color:#eeeeee; border-color:#aaaaaa\"> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-left-color: rgb(170, 170, 170); border-right: 0px; break-inside: avoid; width: 43px;\"><span style=\"font-size:0.875em\">Item</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-right: 0px; border-left: 0px; break-inside: avoid; width: 123px; text-align: left;\"><span style=\"font-size:0.875em\">Grupo</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-right: 0px; border-left: 0px; break-inside: avoid; width: 140px; text-align: left;\"><span style=\"font-size:0.875em\">Produto/Serviço</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-right: 0px; border-left: 0px; break-inside: avoid; width: 61px; text-align: left;\"><span style=\"font-size:0.875em\">Qtd.</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-right: 0px; border-left: 0px; break-inside: avoid; width: 99px; text-align: left;\"><span style=\"font-size:0.875em\">Valor unitário</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-right-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-left: 0px; break-inside: avoid; width: 108px; text-align: left;\"><span style=\"font-size:0.875em\">Desconto</span></th> <th style=\"border-top-color: rgb(170, 170, 170); border-right-color: rgb(170, 170, 170); border-bottom-color: rgb(170, 170, 170); border-left: 0px; break-inside: avoid; width: 125px; text-align: right;\"><span style=\"font-size:0.875em\">Total</span></th> </tr> <tr multiple-field-key=\"order_section_products\"> <td style=\"border-color:#aaaaaa; break-inside:avoid; text-align:center; width:43px\"><span style=\"font-size:0.875em\"><index field-key=\"order_section_products\">1</index></span></td> <td style=\"border-color:#aaaaaa; break-inside:avoid; width:122px\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"product_group_name\">[Grupo do Produto.Nome]</field></span></td> <td style=\"border-color:#aaaaaa; break-inside:avoid; width:139px\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"product_name\">[Produto.Nome]</field></span></td> <td style=\"border-color:#aaaaaa; break-inside:avoid; width:60px\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"order_product_quantity\">[Produto.Quantidade]</field></span></td> <td style=\"border-color:#aaaaaa; break-inside:avoid; width:98px\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"order_product_currency\">[Produto.Moeda]</field>&nbsp;<field class=\"h-card\" format=\"n2\" key=\"order_product_unit_price\">[Produto.Valor unitário]</field></span></td> <td style=\"border-color:#aaaaaa; break-inside:avoid; width:107px\"><condition field-key=\"order_product_discount\" operation=\"&gt;\" value=\"0\"><span style=\"font-size:0.875em\"><field class=\"h-card\" format=\"n1\" key=\"order_product_discount\">[Produto.Desconto]</field>%</span></condition></td> <td style=\"border-color:#aaaaaa; break-inside:avoid; text-align:right; width:125px\"><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"order_product_currency\">[Produto.Moeda]</field>&nbsp;<field class=\"h-card\" format=\"n2\" key=\"order_product_total\">[Produto.Total]</field></span></td> </tr> <tr style=\"background-color:#eeeeee\" condition-field-key=\"order_discount\" condition-operation=\"gt\" condition-value=\"0\"> <td colspan=\"6\" rowspan=\"1\" style=\"border-color:#aaaaaa; break-inside:avoid; text-align:right; width:614px\"><span style=\"font-size:0.875em\">Desconto:</span></td> <td style=\"border-color:#aaaaaa; break-inside:avoid; text-align:right; width:125px\"><span style=\"font-size:0.875em\"><field class=\"h-card\" format=\"n1\" key=\"order_discount\">[Venda.Desconto]</field>%</span></td> </tr> <tr style=\"background-color:#eeeeee\"> <td colspan=\"6\" rowspan=\"1\" style=\"border-color:#aaaaaa; break-inside:avoid; text-align:right; width:614px\"><span style=\"font-size:0.875em\"><strong>Total:</strong></span></td> <td style=\"border-color:#aaaaaa; break-inside:avoid; text-align:right; width:125px\"><span style=\"font-size:0.875em\"><strong><field class=\"h-card\" key=\"order_currency\">[Venda.Moeda]</field>&nbsp;<field class=\"h-card\" format=\"n2\" key=\"order_amount\">[Venda.Valor]</field></strong></span></td> </tr> </tbody> </table> <p>&nbsp;</p> <p><span style=\"font-size:0.875em\"><strong>Informações da venda</strong></span></p> <p><span style=\"font-size:0.875em\"><strong><field key=\"order_agent\" path-id=\"26\">[Venda.Comissionado]</field></strong></span></p> <p><field key=\"order_agent\" path-id=\"26\">[Venda.Comissionado]</field></p> <p><span style=\"font-size:0.875em\"><field class=\"h-card\" key=\"order_description\">[Venda.Informações]</field></span></p> <p>&nbsp;</p> <div style=\"height:5px\">&nbsp;</div> <div style=\"border-bottom:2px solid #aaaaaa; height:2px\">&nbsp;</div> <div style=\"height:5px\">&nbsp;</div> <p><span style=\"font-size:0.875em\"><strong>Responsável</strong></span></p> <div style=\"font-size:0.875em\"> <p><field class=\"h-card\" key=\"user_name\">[Responsável.Nome]</field></p> <p><field class=\"h-card\" key=\"user_email\">[Responsável.E-mail]</field></p> <p><field class=\"h-card\" key=\"user_phone\">[Responsável.Telefone]</field></p> </div> ",
      "TopMargin": 10,
      "BottomMargin": 10,
      "SideMargin": 5,
      "RenderBodyOnly": false,
      "HasPaging": false,
      "Ordination": 0
    }
  ]
}
```

---

### DocumentTemplates (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}DocumentTemplates(32514)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Sections (GET)

**Method:** `GET`

**URL:** `{{server}}DocumentTemplates@Sections`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Sections (POST)

**Method:** `POST`

**URL:** `{{server}}DocumentTemplates@Sections`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Bloquinho",
  "EntityId": 4,
  "BodySourceCode": "<p></p>"
}
```

---

### Sections (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}DocumentTemplates@Sections(1)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Bloquinho",
  "BodySourceCode": "<p>ok</p>"
}
```

---

### Sections (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}DocumentTemplates@Sections(1)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

## Emails

*11 endpoints*

### Emails (GET)

**Method:** `GET`

**URL:** `{{server}}Emails?$top=10&$expand=Attachments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |
| $expand | Attachments |

---

### Emails (POST)

**Method:** `POST`

**URL:** `{{server}}Emails`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "To": "vixgod@gmail.com",
  "Cc": "vinicius.sampaio@ploomes.com",
  "Subject": "Trust me, I'm a computer scientist",
  "Content": "A&iacute; vai<br />\n<br />\n______________________________________________<br />\n<br />\nSe preferir, voc&ecirc; pode acessar sua proposta online <a href=\"https://app.ploomes.com/Propostas?i=CB5F366BA4845F9F8B05DE78CB639CF6FD78D699FB5DBAD58571E49BACC4F4D87919879C7A1DB8E7D90369E63E18508CD19C87F9D0E8ED34B68930EEC7D8B96FA6&amp;k=05B263D63F3E8566D8E1\">aqui</a>",
  "QuoteId": 237479
}
```

---

### Emails (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Emails(377495)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "To": "vixgod@gmail.com",
  "Cc": "vinicius.sampaio@ploomes.com",
  "Subject": "Trust me, I'm a computer scientist",
  "Draft": false,
  "Content": "<b>VAMO</b>"
}
```

---

### Emails (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Emails(377495)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### UploadFile (POST)

**Method:** `POST`

**URL:** `{{server}}Emails(1883)/UploadFile?$expand=Attachments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Attachments |

---

### Status (GET)

**Method:** `GET`

**URL:** `{{server}}Emails@Status`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Templates (GET)

**Method:** `GET`

**URL:** `{{server}}Emails@Templates`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Templates (POST)

**Method:** `POST`

**URL:** `{{server}}Emails@Templates`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Subject": "Ploomes",
  "Content": "Olar",
  "AllowedUsers": [
    {
      "UserId": 116
    }
  ]
}
```

---

### Templates (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Emails@Templates(2)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Meu template",
  "AllowedUsers": []
}
```

---

### Templates (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Emails@Templates(2)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Templates/UploadFile (POST)

**Method:** `POST`

**URL:** `{{server}}Emails(1883)/UploadFile?$expand=Attachments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Attachments |

---

## Fields

*14 endpoints*

### Fields (GET)

**Method:** `GET`

**URL:** `{{server}}Fields?$expand=Type&$top=10&$filter=contains(Name, 's') and OriginFieldFieldPathId eq null`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Type |
| $top | 10 |
| $skip | 10 |
| $filter | contains(Name, 's') and OriginFieldFieldPathId eq null |
| $filter | contains(Name, 'Tam') |
| $filter | Key eq 'interaction_record_C6E39274-2438-4E48-B9A1-4CF9B407E1C6' |

---

### Fields (POST)

**Method:** `POST`

**URL:** `{{server}}Fields`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Opção",
  "EntityId": 2,
  "SecondaryEntityId": null,
  "TypeId": 7,
  "OptionsTable": {
    "Name": "Opções",
    "Options": [
      {
        "Name": "OP"
      }
    ]
  },
  "Multiple": true,
  "Required": false
}
```

---

### Fields (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Fields('contact_consome')`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Consuma"
}
```

---

### Fields (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Fields('contact_shit_text')`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

### Entities (GET)

**Method:** `GET`

**URL:** `{{server}}Fields@Entities`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Entities@Paths (GET)

**Method:** `GET`

**URL:** `{{server}}Fields@Entities@Paths`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Types (GET)

**Method:** `GET`

**URL:** `{{server}}Fields@Types`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### OptionsTables (GET)

**Method:** `GET`

**URL:** `{{server}}Fields@OptionsTables?$expand=Options`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Options |

---

### OptionsTables (POST)

**Method:** `POST`

**URL:** `{{server}}Fields@OptionsTables`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Opções aleatórias"
}
```

---

### OptionsTables@Options (GET)

**Method:** `GET`

**URL:** `{{server}}Fields@OptionsTables@Options`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### OptionsTables@Options (POST)

**Method:** `POST`

**URL:** `{{server}}Fields@OptionsTables@Options`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "TableId": 28,
  "Name": "Maçã"
}
```

---

### OptionsTables@Options (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Fields@OptionsTables@Options(2796)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Rato bom de briga"
}
```

---

### OptionsTables@Options (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Fields@OptionsTables@Options(182)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

### GoogleSheetsIntegrations/CalculateValue (POST)

**Method:** `POST`

**URL:** `{{server}}Fields@GoogleSheetsIntegrations(1)/CalculateValue`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Variables": [
    {
      "ID_Variavel": 332,
      "ID_Campo": 4025,
      "Variavel": "Teste",
      "ValorPadrao": "0",
      "ID_CampoVariavel": 4023,
      "Fixo_CampoVariavel": false,
      "ID_Tabela_CampoVariavel": 14,
      "ID_Tipo_CampoVariavel": 4,
      "VariableId": 332,
      "Value": 5
    }
  ]
}
```

---

## Filters

*4 endpoints*

### Filters (GET)

**Method:** `GET`

**URL:** `{{server}}Filters?$expand=AllowedUsers,AllowedTeams,Fields`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | AllowedUsers,AllowedTeams,Fields |

---

### Filters (POST)

**Method:** `POST`

**URL:** `{{server}}Filters?$expand=AllowedUsers,AllowedTeams,Fields($expand=FieldPath,Values)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | AllowedUsers,AllowedTeams,Fields($expand=FieldPath,Values) |

**Request Body:**
```
/*{
  "Name": "Novo filtro",
  "EntityId": 12,
  "Fields":[
    {
      "FieldKey":"task_title",
      "LogicalGroupNumber": 1,
      "Values":[
        {
          "StringValue": "tituloqlqr2"
        }
      ],
      "FieldPath":[{
        "FieldKey": "task_title"
      }]
    }
  ],
  "AllowedUsers":[
    {
      "UserId": 347
    }
  ],
  "AllowedTeams":[
    {
      "TeamId": 62
    }
  ]
}*/
{
    "Name": "",
    "Url": "$filter=((TypeId+eq+1))",
    "EntityId": 1,
    "Listable": false,
    "Fields": [
        {
            "LogicalGroupNumber": 1,
            "FieldKey": "contact_type",
            "RelativeDate": false,
            "OperationId": 1,
            "SelectorId": null,
            "Values": [
                {
                    "Id": 1107,
                    "FilterFieldId": 1107,
                    "StringValue": null,
                    "IntegerValue": 1,
                    "DecimalValue": null,
                    "DateTimeValue": null,
                    "BoolValue": null
                }
            ]
        }
    ],
    "AllowedUsers": [],
    "AllowedTeams": []
}
// {
//     "EntityId": 1,
//     "Fields": [
//         {
//             "LogicalGroupNumber": 0,
//             "FieldKey": "contact_avatar_url",
//             "RelativeDate": false,
//             "OperationId": null,
//             "Field": {
//                 "Id": 1433,
//                 "Key": "contact_avatar_url",
//                 "Dynamic": false,
//                 "Name": "Avatar",
//                 "EntityId": 1,
//                 "SecondaryEntityId": null,
//                 "TypeId": 18,
//                 "OptionsTableId": null,
//                 "Multiple": false,
//                 "MustSkipManyToManyTable": false,
//                 "Required": false,
//                 "NotNullable": false,
//                 "Permanent": false,
//                 "Unique": false,
//                 "Disabled": false,
//                 "FormHidden": false,
//                 "Hidden": false,
//                 "Integration": false,
//                 "IntegrationCustomFieldId": null,
//                 "Filterable": false,
//                 "FormFilterable": true,
//                 "Importable": true,
//                 "Wide": false,
//                 "ColumnSize": 1,
//                 "InternalFormula": null,
//                 "FieldHideFormula": null,
//                 "FieldDisableFormula": null,
//                 "ExternalFormulaUrl": null,
//                 "ExternalFormulaMethod": null,
//                 "ExternalFormulaHeaders": null,
//                 "ExternalFormulaRequestBody": null,
//                 "DefaultStringValue": null,
//                 "DefaultBigStringValue": null,
//                 "DefaultIntegerValue": null,
//                 "DefaultDecimalValue": null,
//                 "DefaultDateTimeValue": null,
//                 "DefaultBoolValue": null,
//                 "GoogleSheetsIntegrationId": null,
//                 "OriginFieldKey": null,
//                 "OriginFieldFieldPathId": null,
//                 "ApiUrl": null,
//                 "PropertyName": "AvatarUrl",
//                 "UpdatePropertyName": "AvatarUrl",
//                 "DisplayProperty": false,
//                 "AutoParagraph": true,
//                 "Label": null,
//                 "UseCheckbox": null,
//                 "FilterId": null,
//                 "GeneratedFormula": false,
//                 "InlineEditable": true,
//                 "InlineEditTriggerDocumentGeneration": null,
//                 "OptionsCreationPermissionPropertyName": null,
//                 "ProductGroupId": null,
//                 "ProductFamilyId": null,
//                 "ValueEditable": true,
//                 "IsSensitiveData": null,
//                 "ShowTime": null,
//                 "IsMobileEdit": null,
//                 "UseAttachmentUrl": null,
//                 "ClearOnDefaultCrud": false,
//                 "Filter": null,
//                 "FormulaVariables": [],
//                 "ExternalFormulaResponsePaths": [],
//                 "ProductGroup": null,
//                 "ExternalFormulaMappedFields": [],
//                 "Type": {
//                     "Id": 18,
//                     "Name": "Imagem",
//                     "Icon": "fa fa-image regular-fa",
//                     "NativeType": "String",
//                     "Listable": true,
//                     "Multipliable": false,
//                     "StandardFormat": null,
//                     "AllowedOperations": [
//                         {
//                             "FieldTypeId": 18,
//                             "OperationId": 1,
//                             "Operation": {
//                                 "Id": 1,
//                                 "Name": "Igual a"
//                             }
//                         },
//                         {
//                             "FieldTypeId": 18,
//                             "OperationId": 2,
//                             "Operation": {
//                                 "Id": 2,
//                                 "Name": "Diferente de"
//                             }
//                         }
//                     ]
//                 }
//             },
//             "Values": [
//                 {
//                     "StringValue": null
//                 },
//                 {
//                     "IntegerValue": 10
//                 },
//                 {
//                     "IntegerValue": 10
//                 },
//                 {
//                     "IntegerValue": 1
//                 }
//             ]
//         }
//     ],
//     "AllowedTeams": [],
//     "AllowedUsers": [],
//     "Name": ""
// }
```

---

### Filters (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Filters(29)?$expand=AllowedUsers,AllowedTeams,Fields`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | AllowedUsers,AllowedTeams,Fields |

**Request Body:**
```json
{
  "Name": "Filtro tarefa",
  "EntityId": 12,
  "Fields": [
    {
      "FieldKey": "task_description",
      "LogicalGroupNumber": 2,
      "StringValue": "ENVIAR E-MAIL MARKETING"
    },
    {
      "FieldKey": "task_contact",
      "SecondaryEntityFieldKey": "contact_name",
      "LogicalGroupNumber": 2,
      "StringValue": "SÉRGIO LIMAp"
    },
    {
      "FieldKey": "task_contact",
      "SecondaryEntityFieldKey": "contact_name",
      "LogicalGroupNumber": 1,
      "StringValue": "SÉRGIO LIMA"
    }
  ],
  "OperationId": 1,
  "AllowedUsers": [
    {
      "UserId": 347
    }
  ],
  "AllowedTeams": [
    {
      "TeamId": 62
    }
  ]
}
```

---

### Filters (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Filters(2)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

## Forms

*12 endpoints*

### Forms (GET)

**Method:** `GET`

**URL:** `{{server}}Forms?$expand=Fields($expand=Field)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Fields($expand=Field) |
| $top | 1 |

---

### Forms (POST)

**Method:** `POST`

**URL:** `{{server}}Forms`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "EntityId": 4
}
```

---

### Forms (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Forms(17127)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": null
}
```

---

### Forms (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Forms(386664)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Fields (GET)

**Method:** `GET`

**URL:** `{{server}}Forms@Fields`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Fields (POST)

**Method:** `POST`

**URL:** `{{server}}Forms@Fields`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "FormId": 17127,
  "FieldKey": "deal_title",
  "Ordination": 0
}
```

---

### Fields (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Forms@Fields(129493)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Ordination": 10,
  "SectionId": 11213
}
```

---

### Fields (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Forms@Fields(518646)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Sections (GET)

**Method:** `GET`

**URL:** `{{server}}Forms@Sections`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Sections (POST)

**Method:** `POST`

**URL:** `{{server}}Forms@Sections`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "FormId": 17127
}
```

---

### Sections (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Forms@Sections(11213)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Sect",
  "Ordination": 6
}
```

---

### Sections (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Forms@Sections(29637)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## GeneralSearch

*1 endpoints*

### GeneralSearch (GET)

**Method:** `GET`

**URL:** `{{server}}GeneralSearch?$top=10&$orderby=EntityId`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |
| $orderby | EntityId |

---

## Importations

*4 endpoints*

### Importations (GET)

**Method:** `GET`

**URL:** `{{server}}Importations?$expand=MappedFields`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | MappedFields |

---

### Importations (POST)

**Method:** `POST`

**URL:** `{{server}}Importations`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "SpreadsheetUrl": "https://www.ploomes.com",
  "TemplateId": 3050,
  "TotalRows": 30
}
```

---

### MapFields (POST)

**Method:** `POST`

**URL:** `{{server}}Importations(7000)/MapFields`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "MappedFields": [
    {
      "FieldKey": "contact_name",
      "TemplateEntityId": 3050,
      "ColumnIndex": 0,
      "Unique": true
    }
  ]
}
```

---

### Status (GET)

**Method:** `GET`

**URL:** `{{server}}Importations@Status`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Importation Templates

*2 endpoints*

### ImportationTemplates (GET)

**Method:** `GET`

**URL:** `{{server}}ImportationTemplates?$expand=Entities($expand=Relationships,DefaultValues),Columns`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Entities($expand=Relationships,DefaultValues),Columns |

---

### ImportationTemplates (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}ImportationTemplates(2344)?$expand=Entities($expand=Relationships,DefaultValues),Columns`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Entities($expand=Relationships,DefaultValues),Columns |

**Request Body:**
```json
{
  "Name": "Meu template",
  "Columns": [
    {
      "TemplateEntityId": 2344,
      "Column": 1,
      "FieldKey": "contact_name"
    }
  ]
}
```

---

## Interaction Records

*6 endpoints*

### InteractionRecords (GET)

**Method:** `GET`

**URL:** `{{server}}InteractionRecords?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### InteractionRecords (POST)

**Method:** `POST`

**URL:** `{{server}}InteractionRecords`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "ContactId": 1774,
  "Content": "hello"
}
```

---

### InteractionRecords (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}InteractionRecords(3177)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/javascript |

**Request Body:**
```json
{
  "Content": "mudou o conteudo",
  "Date": "2017-08-30",
  "TypeId": 1
}
```

---

### InteractionRecords (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}InteractionRecords(67157)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

### NewComment (POST)

**Method:** `POST`

**URL:** `{{server}}InteractionRecords(3177)/NewComment`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "comentariozin"
}
```

---

### UploadFile (POST)

**Method:** `POST`

**URL:** `{{server}}InteractionRecords(3177)/UploadFile?$expand=Attachments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Attachments |

---

## Leads

*13 endpoints*

### Leads (GET)

**Method:** `GET`

**URL:** `{{server}}Leads?$expand=History($expand=Creator($select=Id,Name,AvatarUrl)),Creator($select=Id,Name,AvatarUrl),Phones($select=PhoneNumber,TypeId,CountryId),Owner($select=Id,Name,AvatarUrl),Tags,OtherProperties($expand=Field($expand=Type;$select=Type);$select=FieldKey,StringValue,BigStringValue,IntegerValue,DecimalValue,DateTimeValue,BoolValue,ObjectValueId,UserValueId,ProductValueId)&$filter=StatusId ne 4 and StatusId ne 5 and StatusId ne 6&$top=200&$skip=18000`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | History($expand=Creator($select=Id,Name,AvatarUrl)),Creator($select=Id,Name,AvatarUrl),Phones($select=PhoneNumber,TypeId,CountryId),Owner($select=Id,Name,AvatarUrl),Tags,OtherProperties($expand=Field($expand=Type;$select=Type);$select=FieldKey,StringValue,BigStringValue,IntegerValue,DecimalValue,DateTimeValue,BoolValue,ObjectValueId,UserValueId,ProductValueId) |
| $filter | StatusId ne 4 and StatusId ne 5 and StatusId ne 6 |
| $top | 200 |
| $skip | 18000 |

---

### Leads (POST)

**Method:** `POST`

**URL:** `{{server}}Leads`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "CompanyName": "Lead Empresa",
  "PersonName": "Lead Contato",
  "Phones": [
    {
      "PhoneNumber": "(11) 4380-7749"
    }
  ],
  "Origin": "Facebook",
  "OwnerId": 116
}
```

---

### Leads (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Leads(1033059)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "CompanyName": "Lead Empresa",
  "PersonName": "Lead Contato",
  "Phones": [
    {
      "PhoneNumber": "(11) 4380-7749"
    }
  ],
  "Origin": "Facebook"
}
```

---

### Leads (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Leads(1033059)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### NewHistory (POST)

**Method:** `POST`

**URL:** `{{server}}Leads(13288)/NewHistory?$expand=History`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | History |

**Request Body:**
```json
{
  "StatusId": 2,
  "Comments": "Agendamento",
  "NextContact": "2018-04-30T18:00:00-03:00"
}
```

---

### Discard (POST)

**Method:** `POST`

**URL:** `{{server}}Leads(13288)/Discard`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "DiscardReasonId": 225
}
```

---

### Convert (POST)

**Method:** `POST`

**URL:** `{{server}}Leads(13300)/Convert`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Company": {
    "Name": "Nova empresa lead"
  },
  "Person": {
    "Name": "MARISTELA"
  },
  "Deal": {
    "Title": "Negócio de conversão",
    "Amount": 1500
  }
}
```

---

### UploadFile (POST)

**Method:** `POST`

**URL:** `{{server}}Leads(13287)/UploadFile?$expand=Attachments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Attachments |

---

### Status (GET)

**Method:** `GET`

**URL:** `{{server}}Leads@Status`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Reminders (GET)

**Method:** `GET`

**URL:** `{{server}}Leads@Reminders`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### DiscardReasons (GET)

**Method:** `GET`

**URL:** `{{server}}Leads@DiscardReasons`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### DiscardReasons (POST)

**Method:** `POST`

**URL:** `{{server}}Leads@DiscardReasons`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Sem tempo"
}
```

---

### BulkUpdate (POST)

**Method:** `POST`

**URL:** `{{server}}Leads/BulkUpdate?$filter=Origin+eq+'Adwords'`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $filter | Origin+eq+'Adwords' |

**Request Body:**
```json
{
  "Tags": [
    {
      "TagId": 61571
    }
  ]
}
```

---

## Messages

*5 endpoints*

### Messages (GET)

**Method:** `GET`

**URL:** `{{server}}Messages?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Messages (POST)

**Method:** `POST`

**URL:** `{{server}}Messages`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "informe",
  "Teams": [
    {
      "TeamId": 159
    }
  ]
}
```

---

### Messages (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Messages(4233)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "Informezera"
}
```

---

### Messages (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Messages(4231)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### NewComment (POST)

**Method:** `POST`

**URL:** `{{server}}Messages(1304)/NewComment`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "gogogo"
}
```

---

## Notifications

*3 endpoints*

### Notifications (GET)

**Method:** `GET`

**URL:** `{{server}}Notifications?$top=10&$expand=Action($expand=PrimaryTargetEntity)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |
| $expand | Action($expand=PrimaryTargetEntity) |

---

### Notifications (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Notifications(3688)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Read": false
}
```

---

### Entities (GET)

**Method:** `GET`

**URL:** `{{server}}Notifications@Entities`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Operations

*1 endpoints*

### Operations (GET)

**Method:** `GET`

**URL:** `{{server}}Operations`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Orders

*12 endpoints*

### Orders (GET)

**Method:** `GET`

**URL:** `{{server}}Orders?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Orders (POST)

**Method:** `POST`

**URL:** `{{server}}Orders?$expand=Products`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Products |

**Request Body:**
```json
{
  "ContactId": 3017,
  "Products": [
    {
      "ProductId": 414,
      "CurrencyId": 1,
      "Quantity": 10,
      "UnitPrice": 90.5,
      "Total": 905
    }
  ],
  "CurrencyId": 1,
  "Amount": 905
}
```

---

### Orders (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Orders(41)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "InternalComments": "comentario",
  "Products": [
    {
      "ProductId": 414,
      "Quantity": 1,
      "UnitPrice": 10,
      "Total": 10
    },
    {
      "ProductId": 414,
      "Quantity": 2,
      "UnitPrice": 50,
      "Total": 100
    },
    {
      "ProductId": 415,
      "Quantity": 3,
      "UnitPrice": 50,
      "Discount": 10,
      "Total": 135
    }
  ]
}
```

---

### Orders (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Orders(555886)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Stages (GET)

**Method:** `GET`

**URL:** `{{server}}Orders@Stages`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Stages (POST)

**Method:** `POST`

**URL:** `{{server}}Orders@Stages`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Entrega"
}
```

---

### Stages (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Orders@Stages(30422)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Ordination": 10
}
```

---

### Stages (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Orders@Stages(30422)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

### Products (GET)

**Method:** `GET`

**URL:** `{{server}}Orders@Products?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### UploadFile (POST)

**Method:** `POST`

**URL:** `{{server}}Orders(112)/UploadFile?$expand=Attachments`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Attachments |

---

### NewComment (POST)

**Method:** `POST`

**URL:** `{{server}}Orders(17)/NewComment`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "comentariozin"
}
```

---

### NewExternalComment (POST)

**Method:** `POST`

**URL:** `{{server}}Orders(17)/NewExternalComment`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "comentariozin"
}
```

---

## Panels

*11 endpoints*

### Panels (GET)

**Method:** `GET`

**URL:** `{{serverAPI2}}Panels?top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| top | 10 |

---

### Panels (POST)

**Method:** `POST`

**URL:** `{{server}}Panels`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Meu painel"
}
```

---

### Panels (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Panels(1)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Meu painel"
}
```

---

### Panels (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Panels(3)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Charts (GET)

**Method:** `GET`

**URL:** `{{server}}Panels@Charts`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Charts (POST)

**Method:** `POST`

**URL:** `{{server}}Panels@Charts?$expand=Metrics`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Metrics |

**Request Body:**
```json
{
  "PanelId": 1,
  "TypeId": 1,
  "Options": null,
  "Metrics": [
    {
      "Name": "Minha métrica",
      "TableId": 39,
      "Color": "#000000",
      "AggregatorId": 1,
      "ModifierId": null
    }
  ]
}
```

---

### Charts (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Panels@Charts(1)?$expand=Metrics`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Metrics |

**Request Body:**
```json
{
  "TypeId": 2,
  "Options": null,
  "Metrics": [
    {
      "Name": "Minha métrica",
      "TableId": 39,
      "Color": "#000000",
      "AggregatorId": 1,
      "ModifierId": null
    }
  ]
}
```

---

### Charts (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Panels@Charts(3)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Charts@Types (GET)

**Method:** `GET`

**URL:** `{{server}}Panels@Charts@Types`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Charts@Metrics@Aggregators (GET)

**Method:** `GET`

**URL:** `{{server}}Panels@Charts@Metrics@Aggregators`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Charts@Metrics@Modifiers (GET)

**Method:** `GET`

**URL:** `{{server}}Panels@Charts@Metrics@Modifiers`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Phone Types

*1 endpoints*

### PhoneTypes (GET)

**Method:** `GET`

**URL:** `{{server}}PhoneTypes`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Products

*17 endpoints*

### Products (GET)

**Method:** `GET`

**URL:** `{{server}}Products?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Products (POST)

**Method:** `POST`

**URL:** `{{server}}Products`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Produto 223",
  "GroupId": 7344
}
```

---

### Products (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Products(414)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Produto 211",
  "Code": null,
  "MeasurementUnit": "kg",
  "CurrencyId": 1,
  "UnitPrice": 10.6
}
```

---

### Products (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Products(248900)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### UploadImage (POST)

**Method:** `POST`

**URL:** `{{server}}Products(414)/UploadImage`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Groups (GET)

**Method:** `GET`

**URL:** `{{server}}Products@Groups`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Groups (POST)

**Method:** `POST`

**URL:** `{{server}}Products@Groups`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Holding"
}
```

---

### Groups (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Products@Groups(1445)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Agrupamento"
}
```

---

### Groups (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Products@Groups(7344)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Families (GET)

**Method:** `GET`

**URL:** `{{server}}Products@Families?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Families (POST)

**Method:** `POST`

**URL:** `{{server}}Products@Families`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Produtos Industriais"
}
```

---

### Families (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Products@Families(11935)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Produtos Cosméticos"
}
```

---

### Families (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Products@Families(11935)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Parts (GET)

**Method:** `GET`

**URL:** `{{server}}Products@Parts?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Parts (POST)

**Method:** `POST`

**URL:** `{{server}}Products@Parts`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "ProductId": 417,
  "ProductPartId": 416,
  "MinimumQuantity": 2,
  "MaximumQuantity": 2,
  "DefaultQuantity": 2,
  "CurrencyId": 1,
  "MinimumUnitPrice": 20,
  "MaximumUnitPrice": 20,
  "DefaultUnitPrice": 20
}
```

---

### Parts (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Products@Parts(9072)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "MinimumQuantity": 3,
  "MaximumQuantity": 5,
  "DefaultQuantity": 4,
  "CurrencyId": 1
}
```

---

### Parts (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Products@Parts(9072)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Public

*2 endpoints*

### Quotes (GET)

**Method:** `GET`

**URL:** `{{server}}Public@Quotes?$expand=Pages,ExternalComments`

**Headers:**

| Header | Value |
|--------|-------|
| Quote-Key | 323E1EE83FA904551695 |
| Account-Public-Key | DCE5DDAB429F6544CD8844C751B4B058A08993A18D766B87221157A7024748E22393F5E7737D60A8138D931B8AB2EF0EEAF86A839D132C8AB1E667FBB0C18339379 |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Pages,ExternalComments |

---

### Quotes@ExternalComments (POST)

**Method:** `POST`

**URL:** `{{server}}Public@Quotes@ExternalComments`

**Headers:**

| Header | Value |
|--------|-------|
| Quote-Key | 323E1EE83FA904551695 |
| Account-Public-Key | DCE5DDAB429F6544CD8844C751B4B058A08993A18D766B87221157A7024748E22393F5E7737D60A8138D931B8AB2EF0EEAF86A839D132C8AB1E667FBB0C18339379 |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "Comentário externo"
}
```

---

## Quotes

*9 endpoints*

### Quotes (GET)

**Method:** `GET`

**URL:** `{{server}}Quotes?$filter=true&$select=QuoteNumber,Id,QuoteNumber,Date,Amount,Contact&$expand=Contact,Deal($select=Id,Title),Creator($select=Id,Name,AvatarUrl),Deal($select=Id,Status;$expand=Status($select=Id,Name))&$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $filter | true |
| $select | QuoteNumber,Id,QuoteNumber,Date,Amount,Contact |
| $expand | Contact,Deal($select=Id,Title),Creator($select=Id,Name,AvatarUrl),Deal($select=Id,Status;$expand=Status($select=Id,Name)) |
| $top | 10 |

---

### Quotes (POST)

**Method:** `POST`

**URL:** `{{server}}Quotes`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Deal": {
    "Title": "Oba",
    "ContactId": 3017
  },
  "TemplateId": 71,
  "Sections": [
    {
      "Products": [
        {
          "ProductId": 414,
          "CurrencyId": 1,
          "Total": 10000,
          "Parts": [
            {
              "ProductId": 414,
              "CurrencyId": 1,
              "Total": 10000
            }
          ]
        }
      ],
      "Code": 1,
      "CurrencyId": 1,
      "Total": 1000
    }
  ],
  "CurrencyId": 1,
  "Amount": 1000
}
```

---

### Quotes (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Quotes(127078)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Sections": [
    {
      "Products": [
        {
          "ProductId": 414,
          "CurrencyId": 1,
          "Total": 10000,
          "Parts": [
            {
              "ProductId": 414,
              "CurrencyId": 1,
              "Total": 10000
            }
          ]
        }
      ],
      "Code": 1,
      "CurrencyId": 1,
      "Total": 1000
    }
  ],
  "CurrencyId": 2,
  "Amount": 20000
}
```

---

### Quotes (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Quotes(127078)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Products (GET)

**Method:** `GET`

**URL:** `{{server}}Quotes@Products?$top=20`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 20 |

---

### Review (POST)

**Method:** `POST`

**URL:** `{{server}}Quotes(18)/Review`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Sections": [
    {
      "Products": [
        {
          "ProductId": 414,
          "CurrencyId": 1,
          "Total": 10000
        }
      ],
      "Code": 1,
      "CurrencyId": 1,
      "Total": 1000
    }
  ],
  "CurrencyId": 1,
  "Amount": 1000
}
```

---

### Approve (POST)

**Method:** `POST`

**URL:** `{{server}}Quotes(127079)/Approve`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Approved": true
}
```

---

### ApprovalStatus (GET)

**Method:** `GET`

**URL:** `{{server}}Quotes@ApprovalStatus`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### NewComment (POST)

**Method:** `POST`

**URL:** `{{server}}Quotes(17)/NewComment`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "comentariozin"
}
```

---

## Relative Dates

*1 endpoints*

### Relative Dates (GET)

**Method:** `GET`

**URL:** `{{server}}RelativeDates`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Roles

*2 endpoints*

### Roles (GET)

**Method:** `GET`

**URL:** `{{server}}Roles`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Roles (POST)

**Method:** `POST`

**URL:** `{{server}}Roles`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Carregador de papel"
}
```

---

## Selectors

*1 endpoints*

### Selectors (GET)

**Method:** `GET`

**URL:** `{{server}}Selectors`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Self

*13 endpoints*

### Self (GET)

**Method:** `GET`

**URL:** `{{server}}Self`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Self (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Self(0)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Rampeira",
  "Filters": [
    {
      "FilterId": 228
    }
  ],
  "TaskTypes": [
    {
      "TaskTypeId": 3
    }
  ],
  "TasksViewMode": "calendar",
  "LastPipelineId": null
}
```

---

### Login (POST)

**Method:** `POST`

**URL:** `{{server}}Self/Login?$expand=Profile,Account`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Profile,Account |
|  | null |

**Request Body:**
```json
{
  "Email": "postman@ploomes.com",
  "Password": "1234"
}
```

---

### Logout (POST)

**Method:** `POST`

**URL:** `{{server}}Self/Logout`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### ResetNotificationsCounter (POST)

**Method:** `POST`

**URL:** `{{server}}Self/ResetNotificationsCounter`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### ResetDealsCounter (POST)

**Method:** `POST`

**URL:** `{{server}}Self/ResetDealsCounter`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### GenerateImportationKey (POST)

**Method:** `POST`

**URL:** `{{server}}Self/GenerateImportationKey`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### EraseImportationKey (POST)

**Method:** `POST`

**URL:** `{{server}}Self/EraseImportationKey`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### GoogleCalendarIntegration (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Self@GoogleCalendarIntegration`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| User-Key | {{uk}} |

**Request Body:**
```json
{
  "CalendarId": "xxx2@gmail.com",
  "CalendarName": "Principal"
}
```

---

### GoogleCalendarIntegration/Authorize (POST)

**Method:** `POST`

**URL:** `{{server}}Self@GoogleCalendarIntegration/Authorize`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| User-Key | {{uk}} |

**Request Body:**
```json
{
  "TemporaryToken": "4/IvUPeAd0njtwXWl1r5sDisu9wLL-sdK4HADZ1TVWgI8"
}
```

---

### GoogleCalendarIntegration/Revoke (POST)

**Method:** `POST`

**URL:** `{{server}}Self@GoogleCalendarIntegration/Revoke`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| User-Key | {{uk}} |

---

### GoogleCalendarIntegration@Calendars (GET)

**Method:** `GET`

**URL:** `{{server}}Self@GoogleCalendarIntegration@Calendars`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### DealsOrdinations (GET)

**Method:** `GET`

**URL:** `{{server}}Self@DealsOrdinations`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Tables

*4 endpoints*

### Tables (GET)

**Method:** `GET`

**URL:** `{{server}}Tables?$top=10`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Tables (POST)

**Method:** `POST`

**URL:** `{{server}}Tables?$expand=Fields($expand=FieldPath)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Fields($expand=FieldPath) |

**Request Body:**
```
{
  "Name": "Tabela de negócios",
  "EntityId": 2,
  "FilterId": 1686,
}
```

---

### Tables (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Tables(1689)?$expand=Fields($expand=FieldPath)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Fields($expand=FieldPath) |

**Request Body:**
```json
{
  "Name": "Tabela de negócios",
  "Fields": [
    {
      "FieldKey": "deal_title",
      "Ordination": 0,
      "AscendingSorting": true
    },
    {
      "FieldKey": "contact_name",
      "Ordination": 1,
      "AscendingSorting": null,
      "FieldPath": [
        {
          "FieldKey": "deal_contact",
          "Ordination": 0
        },
        {
          "FieldKey": "contact_name",
          "Ordination": 1
        }
      ]
    }
  ]
}
```

---

### Tables (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Tables(2)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

## Tags

*5 endpoints*

### Tags (GET)

**Method:** `GET`

**URL:** `{{server}}Tags?$expand=Entity&$filter=EntityId eq 2`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Entity |
| $filter | EntityId eq 2 |

---

### Tags (POST)

**Method:** `POST`

**URL:** `{{server}}Tags`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Marcador Api",
  "EntityId": 2,
  "Color": "#000000"
}
```

---

### Tags (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Tags(501)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Negociação",
  "Color": "#FFFFFF"
}
```

---

### Tags (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Tags(22126)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

---

### Entities (GET)

**Method:** `GET`

**URL:** `{{server}}Tags@Entities`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Tasks

*9 endpoints*

### Tasks (GET)

**Method:** `GET`

**URL:** `{{server}}Tasks?$expand=Tags($expand=Tag),Contacts($expand=Contact),Users($expand=User),User,Deal($select=Title,Id),Comments($orderby=CreateDate;$expand=Creator),Type&$orderby=DateTime&$filter=Finished+eq+false+and+DealId+eq+733894`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Tags($expand=Tag),Contacts($expand=Contact),Users($expand=User),User,Deal($select=Title,Id),Comments($orderby=CreateDate;$expand=Creator),Type |
| $orderby | DateTime |
| $filter | Finished+eq+false+and+DealId+eq+733894 |

---

### Tasks (POST)

**Method:** `POST`

**URL:** `{{server}}Tasks?$expand=Users,Tags`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Users,Tags |

**Request Body:**
```json
{
  "Description": "ttarefa nn55",
  "DateTime": "2016-11-03T15:00:00",
  "Users": [
    {
      "UserId": 347
    }
  ],
  "Tags": [
    {
      "TagId": 643
    }
  ],
  "ContactId": 2720,
  "DealId": 96
}
```

---

### Tasks (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Tasks(54450)?$expand=Users,Tags,Contacts`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $expand | Users,Tags,Contacts |

**Request Body:**
```json
{
  "DateTime": "2015-05-22T08:00:00-03:00",
  "Description": "Tarefa",
  "TypeId": 2,
  "Users": [
    {
      "UserId": 347
    }
  ],
  "Tags": [
    {
      "TagId": 643
    }
  ]
}
```

---

### Tasks (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Tasks(3755)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Types (GET)

**Method:** `GET`

**URL:** `{{server}}Tasks@Types`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### EmailReminders (GET)

**Method:** `GET`

**URL:** `{{server}}Tasks@EmailReminders`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### RepeatIntervalUnits (GET)

**Method:** `GET`

**URL:** `{{server}}Tasks@RepeatIntervalUnits`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Finish (POST)

**Method:** `POST`

**URL:** `{{server}}Tasks(34683)/Finish`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| User-Key | {{uk}} |

**Request Body:**
```json
{
  "Finished": true,
  "Comments": "observado2"
}
```

---

### NewComment (POST)

**Method:** `POST`

**URL:** `{{server}}Tasks(116949)/NewComment`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Content": "comente aqui"
}
```

---

## Teams

*4 endpoints*

### Teams (GET)

**Method:** `GET`

**URL:** `{{server}}Teams`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Teams (POST)

**Method:** `POST`

**URL:** `{{server}}Teams`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Team Red",
  "Users": [
    {
      "UserId": 116
    }
  ]
}
```

---

### Teams (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Teams(985)`

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| User-Key | {{uk}} |

**Request Body:**
```json
{
  "Name": "Team Magma",
  "Users": [
    {
      "UserId": 6331
    },
    {
      "UserId": 116
    }
  ]
}
```

---

### Teams (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Teams(2148)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Timeline

*2 endpoints*

### Timeline (GET)

**Method:** `GET`

**URL:** `{{server}}Timeline?quoteId=597108`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| skip | 10 |
| $expand | Entity,Contact($select=Id,TypeId,Name),Document($select=Id,Name),User($select=Id,AvatarUrl,Name),InteractionRecord($expand=Comments,Attachments,Tags($expand=Tag),Deal,Contact,Contacts($expand=Contact),Type),Deal($expand=Pipeline($select=Id),Contact($select=Id,Name);$select=Id,Title),DealStageHistory($expand=Stage,NewStage,LossReason),Quote($expand=Currency;$select=Id,Currency,QuoteNumber,ReviewNumber,Amount),Order($expand=Currency),DealStageHistory($expand=LossReason,Stage,NewStage),ContactImport,Survey,EmailMarketing($expand=Action,Contact),Note,ExternalComment,QuoteApproval($expand=Quote),ExternalAcceptance($expand=Quote,Order,Document),Email($expand=Recipients($expand=Contact,User),SenderContact,SenderUser,Attachments,Deal),OrderStageHistory($expand=Stage,NewStage) |
| quoteId | 597108 |

---

### Entities (GET)

**Method:** `GET`

**URL:** `{{server}}Timeline@Entities`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

## Users

*13 endpoints*

### Users (GET)

**Method:** `GET`

**URL:** `{{server}}Users`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| $top | 10 |

---

### Users (POST)

**Method:** `POST`

**URL:** `{{server}}Users`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Vinicius",
  "Email": "vina31@ploomes.com",
  "ProfileId": 1,
  "Password": "1234",
  "Integration": true
}
```

---

### Users (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Users(20046)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Paulo"
}
```

---

### UploadAvatar (POST)

**Method:** `POST`

**URL:** `{{server}}Users(1)/UploadAvatar`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### IsDuplicate (POST)

**Method:** `POST`

**URL:** `{{server}}Users/IsDuplicate`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Email": ""
}
```

---

### Profiles (GET)

**Method:** `GET`

**URL:** `{{server}}Users@Profiles`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Profiles (POST)

**Method:** `POST`

**URL:** `{{server}}Users@Profiles`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Vendedor - copy",
  "ContactsModule": true,
  "ContactsView": 1,
  "ContactsEdit": 4,
  "ContactsDelete": 4,
  "ContactsCreatePermission": false,
  "DealsModule": true,
  "DealsView": 3,
  "DealsEdit": 3,
  "DealsDelete": 3,
  "DealsCreatePermission": true,
  "DealsWinOrLosePermission": true,
  "DealsReopenPermission": true,
  "QuotesCreatePermission": true,
  "LeadsModule": true,
  "LeadsView": 3,
  "LeadsEdit": 3,
  "LeadsUpdateStatusPermission": true,
  "LeadsDelete": 3,
  "LeadsCreatePermission": true,
  "OrdersModule": true,
  "OrdersView": 3,
  "OrdersEdit": 3,
  "OrdersDelete": 3,
  "OrdersCreatePermission": true,
  "UsersView": 1,
  "ProductsAdministerPermission": false,
  "ProductsCreatePermission": true,
  "ProductsEditPermission": false,
  "ProductsDeletePermission": false,
  "TablesCreatePermission": false,
  "LossReasonsCreatePermission": true,
  "TagsCreatePermission": true,
  "CitiesCreatePermission": true,
  "OtherOptionsCreatePermission": true,
  "ExcelExportPermission": false,
  "ExcelImportPermission": true
}
```

---

### Profiles (PATCH)

**Method:** `PATCH`

**URL:** `{{server}}Users@Profiles(49558)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "Name": "Vendedor - copy(2)",
  "ContactsModule": true,
  "ContactsView": 1,
  "ContactsEdit": 4,
  "ContactsDelete": 4,
  "ContactsCreatePermission": true,
  "DealsModule": true,
  "DealsView": 3,
  "DealsEdit": 3,
  "DealsDelete": 3,
  "DealsCreatePermission": true,
  "DealsWinOrLosePermission": true,
  "DealsReopenPermission": true,
  "QuotesCreatePermission": true,
  "LeadsModule": true,
  "LeadsView": 3,
  "LeadsEdit": 3,
  "LeadsUpdateStatusPermission": true,
  "LeadsDelete": 3,
  "LeadsCreatePermission": true,
  "OrdersModule": true,
  "OrdersView": 3,
  "OrdersEdit": 3,
  "OrdersDelete": 3,
  "OrdersCreatePermission": true,
  "UsersView": 1,
  "ProductsAdministerPermission": false,
  "ProductsCreatePermission": true,
  "ProductsEditPermission": false,
  "ProductsDeletePermission": false,
  "TablesCreatePermission": false,
  "LossReasonsCreatePermission": true,
  "TagsCreatePermission": true,
  "CitiesCreatePermission": true,
  "OtherOptionsCreatePermission": true,
  "ExcelExportPermission": false,
  "ExcelImportPermission": true
}
```

---

### Profiles (DELETE)

**Method:** `DELETE`

**URL:** `{{server}}Users@Profiles(49558)`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "ReplacementId": 49559
}
```

---

### GetContactOwners (GET)

**Method:** `GET`

**URL:** `{{server}}Users/GetContactOwners`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### GetDealOwners (GET)

**Method:** `GET`

**URL:** `{{server}}Users/GetDealOwners?contactId=1`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| contactId | 1 |

---

### GetLeadOwners (GET)

**Method:** `GET`

**URL:** `{{server}}Users/GetLeadOwners`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### GetOrderOwners (GET)

**Method:** `GET`

**URL:** `{{server}}Users/GetOrderOwners?contactId=2720`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

**Query Parameters:**

| Parameter | Value |
|-----------|-------|
| contactId | 2720 |

---

## Webhooks

*5 endpoints*

### Webhooks (GET)

**Method:** `GET`

**URL:** `{{server}}Webhooks`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Webhooks (POST)

**Method:** `POST`

**URL:** `Webhooks`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "EntityId": 1,
  "ActionId": 2,
  "CallbackUrl": "url",
  "ValidationKey": "7654"
}
```

---

### Actions (GET)

**Method:** `GET`

**URL:** `Actions`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Webhooks (DELETE)

**Method:** `DELETE`

**URL:** `Webhooks`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |

---

### Webhooks (PATCH)

**Method:** `PATCH`

**URL:** `Webhooks`

**Headers:**

| Header | Value |
|--------|-------|
| User-Key | {{uk}} |
| Content-Type | application/json |

**Request Body:**
```json
{
  "ActionId": 2
}
```

---

## Expand

## Batch

## Find in array

