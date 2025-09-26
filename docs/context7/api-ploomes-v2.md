================
CODE SNIPPETS
================
TITLE: Get Account Payment Methods
DESCRIPTION: Retrieves a list of available payment methods for the account. Requires a 'User-Key' header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
GET {{server}}Account@Payments@Methods

Headers:
User-Key: {{uk}}
```

--------------------------------

TITLE: Get Account Plans
DESCRIPTION: Retrieves information about the account's current plans. Requires a 'User-Key' header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
GET {{server}}Account@Plans

Headers:
User-Key: {{uk}}
```

--------------------------------

TITLE: Get Account Cancellation Reasons
DESCRIPTION: Retrieves a list of reasons for account cancellation. Requires a 'User-Key' header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
GET {{server}}Account@CancelReasons

Headers:
User-Key: {{uk}}
```

--------------------------------

TITLE: PloomES API: Get Options Tables with Options
DESCRIPTION: Retrieves options tables along with their associated options from the PloomES API. Requires a User-Key header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
GET {{server}}Fields@OptionsTables?$expand=Options

```

--------------------------------

TITLE: PloomES API: Get Entities
DESCRIPTION: Retrieves entities from the PloomES API. Requires a User-Key header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
GET {{server}}Fields@Entities

```

--------------------------------

TITLE: Get RDStation Integration Behaviors
DESCRIPTION: Retrieves behavior data for the RDStation integration associated with the account. Requires a 'User-Key' header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
GET {{server}}Account@RDStationIntegration@Behaviors

Headers:
User-Key: {{uk}}
```

--------------------------------

TITLE: Get Account Integrations
DESCRIPTION: Retrieves account integration details, including associated fields. Requires a 'User-Key' header for authentication.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
GET {{server}}Account@Integrations?$expand=Integration($expand=Fields)

Headers:
User-Key: {{uk}}
```

--------------------------------

TITLE: PloomES API: Get Options Table Options
DESCRIPTION: Retrieves options for a specific options table from the PloomES API. Requires a User-Key header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
GET {{server}}Fields@OptionsTables@Options

```

--------------------------------

TITLE: GET /api/Fields@OptionsTables@Options
DESCRIPTION: Retrieves a list of options within the options tables.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## GET /api/Fields@OptionsTables@Options

### Description
Retrieves a list of options available in the options tables.

### Method
GET

### Endpoint
{{server}}Fields@OptionsTables@Options

### Headers
- **User-Key** (string) - Required - API key for authentication.
```

--------------------------------

TITLE: GET /api/Fields@Entities
DESCRIPTION: Retrieves information about entities associated with fields.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## GET /api/Fields@Entities

### Description
Retrieves a list of entities associated with fields.

### Method
GET

### Endpoint
{{server}}Fields@Entities

### Headers
- **User-Key** (string) - Required - API key for authentication.
```

--------------------------------

TITLE: GET /api/Fields@Types
DESCRIPTION: Retrieves a list of available field types.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## GET /api/Fields@Types

### Description
Retrieves a list of available types for fields.

### Method
GET

### Endpoint
{{server}}Fields@Types

### Headers
- **User-Key** (string) - Required - API key for authentication.
```

--------------------------------

TITLE: PloomES API: Get Types
DESCRIPTION: Retrieves types from the PloomES API. Requires a User-Key header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
GET {{server}}Fields@Types

```

--------------------------------

TITLE: GET /api/Fields@OptionsTables
DESCRIPTION: Retrieves a list of options tables, with the ability to expand the associated options.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## GET /api/Fields@OptionsTables

### Description
Retrieves a list of options tables. Supports expanding the associated 'Options'.

### Method
GET

### Endpoint
{{server}}Fields@OptionsTables

### Query Parameters
- **$expand** (string) - Optional - Specifies related data to include, 'Options' in this case.

### Headers
- **User-Key** (string) - Required - API key for authentication.
```

--------------------------------

TITLE: GET /api/Fields@Entities@Paths
DESCRIPTION: Retrieves information about the paths of entities related to fields.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## GET /api/Fields@Entities@Paths

### Description
Retrieves information about entity paths associated with fields.

### Method
GET

### Endpoint
{{server}}Fields@Entities@Paths

### Headers
- **User-Key** (string) - Required - API key for authentication.
```

--------------------------------

TITLE: PloomES API: Get Filters with Expansions
DESCRIPTION: Retrieves filters from the PloomES API, with options to expand related user and team information. Requires a User-Key header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
GET {{server}}Filters?$expand=AllowedUsers,AllowedTeams,Fields

```

--------------------------------

TITLE: Get Account Payments
DESCRIPTION: Retrieves account payment information, including payment methods and services. Requires a 'User-Key' header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
GET {{server}}Account@Payments?$expand=Method,Service

Headers:
User-Key: {{uk}}
```

--------------------------------

TITLE: Get Reev Integration Behaviors
DESCRIPTION: Retrieves behavior data for the Reev integration associated with the account. Requires a 'User-Key' header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
GET {{server}}Account@ReevIntegration@Behaviors

Headers:
User-Key: {{uk}}
```

--------------------------------

TITLE: PloomES API: Get Entities Paths
DESCRIPTION: Retrieves entity paths from the PloomES API. Requires a User-Key header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
GET {{server}}Fields@Entities@Paths

```

--------------------------------

TITLE: GET /api/Filters
DESCRIPTION: Retrieves a list of filters, with options to expand related data such as allowed users, teams, and fields.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## GET /api/Filters

### Description
Retrieves a list of filters. Supports expanding related entities like 'AllowedUsers', 'AllowedTeams', and 'Fields'.

### Method
GET

### Endpoint
{{server}}Filters

### Query Parameters
- **$expand** (string) - Optional - Specifies related data to include (e.g., 'AllowedUsers,AllowedTeams,Fields').

### Headers
- **User-Key** (string) - Required - API key for authentication.
```

--------------------------------

TITLE: Get MailChimp Integration Details
DESCRIPTION: Retrieves the current configuration or status of the MailChimp integration for the account. Requires a 'User-Key' header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
GET {{server}}Account@MailChimpIntegration

Headers:
User-Key: {{uk}}
```

--------------------------------

TITLE: PloomES API: Get Fields with Filters
DESCRIPTION: Retrieves fields from the PloomES API, with options to expand related data and filter by various criteria. Requires a User-Key header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
GET {{server}}Fields?$expand=Type&$top=10&$filter=contains(Name, 's') and OriginFieldFieldPathId eq null

```

LANGUAGE: HTTP
CODE:
```
GET {{server}}Fields?$expand=Type&$top=10&$filter=contains(Name, 'Tam')

```

LANGUAGE: HTTP
CODE:
```
GET {{server}}Fields?$expand=Type&$top=10&$filter=Key eq 'interaction_record_C6E39274-2438-4E48-B9A1-4CF9B407E1C6'

```

--------------------------------

TITLE: GET /api/Fields
DESCRIPTION: Retrieves a list of fields with options to expand related data, limit results, and filter based on various criteria.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## GET /api/Fields

### Description
Retrieves a list of fields. Supports expanding related data (Type), limiting the number of results, and filtering based on name or other criteria.

### Method
GET

### Endpoint
{{server}}Fields

### Query Parameters
- **$expand** (string) - Optional - Specifies related data to include in the response (e.g., 'Type').
- **$top** (integer) - Optional - Limits the number of results returned.
- **$skip** (integer) - Optional - Skips a specified number of results.
- **$filter** (string) - Optional - Filters the results based on various conditions (e.g., 'contains(Name, 's')', 'OriginFieldFieldPathId eq null', 'Key eq 'interaction_record_C6E39274-2438-4E48-B9A1-4CF9B407E1C6'').

### Headers
- **User-Key** (string) - Required - API key for authentication.
```

--------------------------------

TITLE: PloomES API: Create Options Table
DESCRIPTION: Creates a new options table in the PloomES system. Requires a User-Key and Content-Type header, along with a JSON request body specifying the table name.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
POST {{server}}Fields@OptionsTables

```

LANGUAGE: JSON
CODE:
```
{
  "Name": "Opções aleatórias"
}

```

--------------------------------

TITLE: POST /api/Fields@OptionsTables
DESCRIPTION: Creates a new options table with a specified name.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## POST /api/Fields@OptionsTables

### Description
Creates a new options table.

### Method
POST

### Endpoint
{{server}}Fields@OptionsTables

### Request Body
- **Name** (string) - Required - The name of the options table.

### Request Example
```json
{
  "Name": "Opções aleatórias"
}
```

### Headers
- **User-Key** (string) - Required - API key for authentication.
- **Content-Type** (string) - Required - Set to 'application/json'.
```

--------------------------------

TITLE: PloomES API: Create Field
DESCRIPTION: Creates a new field in the PloomES system. Requires a User-Key and Content-Type header, along with a JSON request body specifying field details.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
POST {{server}}Fields

```

LANGUAGE: JSON
CODE:
```
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

--------------------------------

TITLE: Displaying Sales Information and Responsible Party Details in HTML
DESCRIPTION: This snippet showcases how to display additional sales information, such as a date and a description, followed by the contact details of the person responsible for the order. It uses HTML fields for dynamic data insertion.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: html
CODE:
```
<tr><td colspan="7"><field key="quote_section_885E1DCA-6ABD-4FD7-A934-7EF396C67975" format="dd/MMM/yyyy">Data ale</field></td></tr>
</tbody>
</table>
<p>&nbsp;</p>
<p><span style="font-size:0.875em"><strong>Informa&ccedil;&otilde;es da venda</strong></span></p>
<p><span style="font-size:0.875em"><field key="order_description">[Venda.Informa&ccedil;&otilde;es]</field></span></p>
<p>&nbsp;</p>
<div style="height: 5px">&nbsp;</div>
<div style="border-bottom: 2px solid #aaa; height: 2px;">&nbsp;</div>
<div style="height: 5px">&nbsp;</div>
<p><span style="font-size:0.875em"><strong>Respons&aacute;vel</strong></span></p>
<div style="font-size:0.875em">
 <p><span><field key="user_name">[Respons&aacute;vel.Nome]</field></span></p>
 <p><span><field key="user_email">[Respons&aacute;vel.E-mail]</field></span></p>
 <p><span><field key="user_phone">[Respons&aacute;vel.Telefone]</field></span></p>
</div>
```

--------------------------------

TITLE: Displaying Order Product Details in HTML
DESCRIPTION: This snippet demonstrates how to structure HTML table rows to display individual product details within a sales order. It includes fields for product index, name, quantity, unit price, discount, and total, along with currency symbols and formatting. It also shows conditional rendering for product discounts.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: html
CODE:
```
<tr products="true">
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 43px; text-align: center;"><span style="font-size:0.875em"><product-index>1</product-index></span></td>
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 122px;"><span style="font-size:0.875em"><field key="product_group_name">[Grupo do Produto.Nome]</field></span></td>
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 139px;"><span style="font-size:0.875em"><field key="product_name">[Produto.Nome]</field></span></td>
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 60px;"><span style="font-size:0.875em"><field key="order_product_quantity">[Produto.Quantidade]</field></span></td>
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 98px;"><span style="font-size:0.875em"><field key="currency_symbol">[Produto.Moeda]</field>&nbsp;<field key="order_product_unit_price" format="n2">[Produto.Valor unit&aacute;rio]</field></span></td>
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 107px;"><condition field-key="order_product_discount" operation=">" value="0"><span style="font-size:0.875em"><field key="order_product_discount" format="n1">[Produto.Desconto]</field>%</span></condition></td>
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 125px; text-align: right;"><span style="font-size:0.875em"><field key="currency_symbol">[Produto.Moeda]</field>&nbsp;<field key="order_product_total" format="n2">[Produto.Total]</field></span></td>
 </tr>
```

--------------------------------

TITLE: Upload Account Logo
DESCRIPTION: Uploads a logo for the account. Requires 'Content-Type' and 'User-Key' headers.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
POST {{server}}Account/UploadLogo

Headers:
Content-Type: application/x-www-form-urlencoded
User-Key: {{uk}}
```

--------------------------------

TITLE: PloomES API: Create Options Table Option
DESCRIPTION: Creates a new option within an options table in the PloomES system. Requires a User-Key and Content-Type header, with a JSON request body specifying the table ID and option name.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
POST {{server}}Fields@OptionsTables@Options

```

LANGUAGE: JSON
CODE:
```
{
  "TableId": 28,
  "Name": "Maçã"
}

```

--------------------------------

TITLE: POST /api/Fields
DESCRIPTION: Creates a new field with specified properties, including its name, entity association, type, and optional configuration for options tables.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## POST /api/Fields

### Description
Creates a new field with the provided details.

### Method
POST

### Endpoint
{{server}}Fields

### Request Body
- **Name** (string) - Required - The name of the field.
- **EntityId** (integer) - Required - The ID of the entity this field belongs to.
- **SecondaryEntityId** (any) - Optional - The ID of a secondary entity, if applicable.
- **TypeId** (integer) - Required - The ID of the field's type.
- **OptionsTable** (object) - Optional - Configuration for an associated options table.
    - **Name** (string) - Required - The name of the options table.
    - **Options** (array) - Required - A list of options within the table.
        - **Name** (string) - Required - The name of an option.
- **Multiple** (boolean) - Optional - Indicates if the field can have multiple values.
- **Required** (boolean) - Optional - Indicates if the field is mandatory.

### Request Example
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

### Headers
- **User-Key** (string) - Required - API key for authentication.
- **Content-Type** (string) - Required - Set to 'application/json'.
```

--------------------------------

TITLE: Configure MailChimp Integration
DESCRIPTION: Configures or updates the MailChimp integration settings for the account. Requires 'User-Key' and 'Content-Type' headers, along with a JSON request body containing temporary token and redirect URI.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
POST {{server}}Account@MailChimpIntegration

Headers:
User-Key: {{uk}}
Content-Type: application/json

Request Body:
{
  "TemporaryToken": "X",
  "RedirectUri": "https://new.ploomes.com"
}
```

--------------------------------

TITLE: Account API
DESCRIPTION: Provides endpoints for managing account-related operations such as retrieving integration details, updating account information, uploading logos, managing payments, plans, and cancellations.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## GET /api/Account@Integrations?$expand=Integration($expand=Fields)

### Description
Retrieves account integration details, including expanded integration and fields information.

### Method
GET

### Endpoint
`{{server}}Account@Integrations?$expand=Integration($expand=Fields)`

### Parameters
#### Query Parameters
- **$expand** (string) - Required - Specifies the expansion of related data, such as `Integration($expand=Fields)`.

### Request Example
N/A

### Response
#### Success Response (200)
- **integration** (object) - Details about the account integration.
- **fields** (array) - List of fields associated with the integration.

#### Response Example
```json
{
  "integration": {
    "id": 1,
    "name": "Example Integration",
    "fields": [
      {
        "id": 101,
        "name": "Field 1"
      }
    ]
  }
}
```
```

LANGUAGE: APIDOC
CODE:
```
## PATCH /api/Account(0)

### Description
Updates the account information, specifically the account name.

### Method
PATCH

### Endpoint
`{{server}}Account(0)`

### Parameters
#### Request Body
- **Name** (string) - Required - The new name for the account.

### Request Example
```json
{
  "Name": "Empresa"
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the update.

#### Response Example
```json
{
  "message": "Account updated successfully."
}
```
```

LANGUAGE: APIDOC
CODE:
```
## POST /api/Account/UploadLogo

### Description
Uploads a logo for the account.

### Method
POST

### Endpoint
`{{server}}Account/UploadLogo`

### Parameters
#### Headers
- **Content-Type** (string) - Required - Set to `application/x-www-form-urlencoded`.
- **User-Key** (string) - Required - The user's API key.

### Request Example
N/A (This endpoint typically expects form data or multipart/form-data)

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the logo upload.

#### Response Example
```json
{
  "message": "Logo uploaded successfully."
}
```
```

LANGUAGE: APIDOC
CODE:
```
## GET /api/Account@Payments?$expand=Method,Service

### Description
Retrieves a list of account payments, expanding details for payment methods and services.

### Method
GET

### Endpoint
`{{server}}Account@Payments?$expand=Method,Service`

### Parameters
#### Query Parameters
- **$expand** (string) - Required - Specifies the expansion of related data, such as `Method,Service`.

### Request Example
N/A

### Response
#### Success Response (200)
- **payments** (array) - List of payment objects, each with expanded method and service details.

#### Response Example
```json
[
  {
    "id": 1,
    "amount": 100.50,
    "method": {"id": 1, "name": "Credit Card"},
    "service": {"id": 5, "name": "Subscription"}
  }
]
```
```

LANGUAGE: APIDOC
CODE:
```
## GET /api/Account@Payments@Methods

### Description
Retrieves a list of available payment methods for the account.

### Method
GET

### Endpoint
`{{server}}Account@Payments@Methods`

### Request Example
N/A

### Response
#### Success Response (200)
- **methods** (array) - List of payment method objects.

#### Response Example
```json
[
  {
    "id": 1,
    "name": "Credit Card"
  },
  {
    "id": 2,
    "name": "Bank Transfer"
  }
]
```
```

LANGUAGE: APIDOC
CODE:
```
## GET /api/Account@Plans

### Description
Retrieves a list of available account plans.

### Method
GET

### Endpoint
`{{server}}Account@Plans`

### Request Example
N/A

### Response
#### Success Response (200)
- **plans** (array) - List of available plan objects.

#### Response Example
```json
[
  {
    "id": 1,
    "name": "Basic Plan",
    "price": 50.00
  }
]
```
```

LANGUAGE: APIDOC
CODE:
```
## GET /api/Account@CancelReasons

### Description
Retrieves a list of reasons for account cancellation.

### Method
GET

### Endpoint
`{{server}}Account@CancelReasons`

### Request Example
N/A

### Response
#### Success Response (200)
- **reasons** (array) - List of cancellation reason objects.

#### Response Example
```json
[
  {
    "id": 7,
    "name": "Dissatisfaction"
  }
]
```
```

LANGUAGE: APIDOC
CODE:
```
## POST /api/Account/Cancel

### Description
Cancels the account with specified reasons.

### Method
POST

### Endpoint
`{{server}}Account/Cancel`

### Parameters
#### Headers
- **Content-Type** (string) - Required - Set to `application/json`.
- **User-Key** (string) - Required - The user's API key.

#### Request Body
- **Reasons** (array) - Required - A list of cancellation reason objects, each containing `ReasonId` and `Comments`.

### Request Example
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

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the cancellation.

#### Response Example
```json
{
  "message": "Account cancellation requested."
}
```
```

LANGUAGE: APIDOC
CODE:
```
## GET /api/Account@RDStationIntegration@Behaviors

### Description
Retrieves the behaviors related to the RDStation integration for the account.

### Method
GET

### Endpoint
`{{server}}Account@RDStationIntegration@Behaviors`

### Request Example
N/A

### Response
#### Success Response (200)
- **behaviors** (array) - List of behaviors associated with RDStation integration.

#### Response Example
```json
[
  {
    "id": 1,
    "name": "Lead Created"
  }
]
```
```

LANGUAGE: APIDOC
CODE:
```
## GET /api/Account@ReevIntegration@Behaviors

### Description
Retrieves the behaviors related to the Reev integration for the account.

### Method
GET

### Endpoint
`{{server}}Account@ReevIntegration@Behaviors`

### Request Example
N/A

### Response
#### Success Response (200)
- **behaviors** (array) - List of behaviors associated with Reev integration.

#### Response Example
```json
[
  {
    "id": 1,
    "name": "Contact Synced"
  }
]
```
```

LANGUAGE: APIDOC
CODE:
```
## GET /api/Account@MailChimpIntegration

### Description
Retrieves the MailChimp integration status and details for the account.

### Method
GET

### Endpoint
`{{server}}Account@MailChimpIntegration`

### Request Example
N/A

### Response
#### Success Response (200)
- **integrationStatus** (string) - The status of the MailChimp integration (e.g., 'Connected', 'Disconnected').

#### Response Example
```json
{
  "integrationStatus": "Connected"
}
```
```

LANGUAGE: APIDOC
CODE:
```
## POST /api/Account@MailChimpIntegration

### Description
Sets up or updates the MailChimp integration for the account using a temporary token and redirect URI.

### Method
POST

### Endpoint
`{{server}}Account@MailChimpIntegration`

### Parameters
#### Headers
- **User-Key** (string) - Required - The user's API key.
- **Content-Type** (string) - Required - Set to `application/json`.

#### Request Body
- **TemporaryToken** (string) - Required - The temporary token obtained from MailChimp authentication.
- **RedirectUri** (string) - Required - The URI to redirect to after successful integration.

### Request Example
```json
{
  "TemporaryToken": "X",
  "RedirectUri": "https://new.ploomes.com"
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the MailChimp integration setup.

#### Response Example
```json
{
  "message": "MailChimp integration updated successfully."
}
```
```

--------------------------------

TITLE: Cancel Account
DESCRIPTION: Initiates the account cancellation process. Requires 'User-Key' and 'Content-Type' headers, along with a JSON request body specifying cancellation reasons.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
POST {{server}}Account/Cancel

Headers:
User-Key: {{uk}}
Content-Type: application/json

Request Body:
{
  "Reasons": [
    {
      "ReasonId": 7,
      "Comments": "Nada"
    }
  ]
}
```

--------------------------------

TITLE: Displaying Order Totals and Discounts in HTML
DESCRIPTION: This snippet shows how to display the overall order discount and the final order total in an HTML table. It uses conditional rendering for the order discount and applies bold formatting to the final total amount, including currency symbols and numerical formatting.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: html
CODE:
```
<condition field-key="order_discount" operation=">" value="0">
 <tr style="background-color: rgb(238, 238, 238)">
 <td colspan="6" rowspan="1" style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 614px; text-align: right;"><span style="font-size:0.875em">Desconto:</span></td>
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 125px; text-align: right;"><span style="font-size:0.875em"><field key="order_discount" format="n1">[Venda.Desconto]</field>%</span></td>
 </tr>
</condition>
<tr style="background-color: rgb(238, 238, 238)">
 <td colspan="6" rowspan="1" style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 614px; text-align: right;"><span style="font-size:0.875em"><strong>Total:</strong></span></td>
 <td style="border-color: rgb(170, 170, 170); break-inside: avoid; width: 125px; text-align: right;"><span style="font-size:0.875em"><strong><field key="currency_symbol">[Venda.Moeda]</field>&nbsp;<field key="order_amount" format="n2">[Venda.Valor]</field></strong></span></td>
 </tr>
```

--------------------------------

TITLE: POST /api/Fields@OptionsTables@Options
DESCRIPTION: Creates a new option within a specified options table, linking it by TableId.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## POST /api/Fields@OptionsTables@Options

### Description
Creates a new option within an options table.

### Method
POST

### Endpoint
{{server}}Fields@OptionsTables@Options

### Request Body
- **TableId** (integer) - Required - The ID of the options table to which the option belongs.
- **Name** (string) - Required - The name of the option.

### Request Example
```json
{
  "TableId": 28,
  "Name": "Maçã"
}
```

### Headers
- **User-Key** (string) - Required - API key for authentication.
- **Content-Type** (string) - Required - Set to 'application/json'.
```

--------------------------------

TITLE: Update Account Information
DESCRIPTION: Updates account information, such as the company name. Requires 'User-Key' and 'Content-Type' headers, along with a JSON request body.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: http
CODE:
```
PATCH {{server}}Account(0)

Headers:
User-Key: {{uk}}
Content-Type: application/json

Request Body:
{
  "Name": "Empresa"
}
```

--------------------------------

TITLE: PloomES API: Update Options Table Option
DESCRIPTION: Updates an existing option within an options table in the PloomES system. Requires a User-Key and Content-Type header, with a JSON request body containing the updated option name.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
PATCH {{server}}Fields@OptionsTables@Options(2796)

```

LANGUAGE: JSON
CODE:
```
{
  "Name": "Rato bom de briga"
}

```

--------------------------------

TITLE: PloomES API: Update Field
DESCRIPTION: Updates an existing field in the PloomES system using its ID. Requires a User-Key and Content-Type header, with a JSON request body containing the fields to update.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
PATCH {{server}}Fields('contact_consome')

```

LANGUAGE: JSON
CODE:
```
{
  "Name": "Consuma"
}

```

--------------------------------

TITLE: PloomES API: Delete Options Table Option
DESCRIPTION: Deletes an option from an options table in the PloomES system using its ID. Requires a User-Key and Content-Type header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
DELETE {{server}}Fields@OptionsTables@Options(182)

```

--------------------------------

TITLE: PloomES API: Calculate Value for Google Sheets Integration
DESCRIPTION: Calculates a value for a Google Sheets integration in the PloomES API. Requires a User-Key and Content-Type header, with a JSON request body containing variable details.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
POST {{server}}Fields@GoogleSheetsIntegrations(1)/CalculateValue

```

LANGUAGE: JSON
CODE:
```
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

--------------------------------

TITLE: PATCH /api/Fields@OptionsTables@Options/{id}
DESCRIPTION: Updates an existing option within an options table, identified by its unique ID.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## PATCH /api/Fields@OptionsTables@Options/{id}

### Description
Updates an existing option within an options table, identified by its unique ID.

### Method
PATCH

### Endpoint
{{server}}Fields@OptionsTables@Options(2796)

### Request Body
- **Name** (string) - Optional - The new name for the option.

### Request Example
```json
{
  "Name": "Rato bom de briga"
}
```

### Headers
- **User-Key** (string) - Required - API key for authentication.
- **Content-Type** (string) - Required - Set to 'application/json'.
```

--------------------------------

TITLE: PloomES API: Delete Field
DESCRIPTION: Deletes a field from the PloomES system using its ID. Requires a User-Key and Content-Type header.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: HTTP
CODE:
```
DELETE {{server}}Fields('contact_shit_text')

```

--------------------------------

TITLE: PATCH /api/Fields/{id}
DESCRIPTION: Updates an existing field identified by its ID, allowing modification of its properties like name.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## PATCH /api/Fields/{id}

### Description
Updates an existing field identified by its unique ID.

### Method
PATCH

### Endpoint
{{server}}Fields('contact_consome')

### Request Body
- **Name** (string) - Optional - The new name for the field.

### Request Example
```json
{
  "Name": "Consuma"
}
```

### Headers
- **User-Key** (string) - Required - API key for authentication.
- **Content-Type** (string) - Required - Set to 'application/json'.
```

--------------------------------

TITLE: POST /api/Fields/GoogleSheetsIntegrations/{id}/CalculateValue
DESCRIPTION: Calculates a value related to Google Sheets integration for a specific field, using provided variables.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## POST /api/Fields/GoogleSheetsIntegrations/{id}/CalculateValue

### Description
Calculates a value for Google Sheets integration using a list of variables.

### Method
POST

### Endpoint
{{server}}Fields@GoogleSheetsIntegrations(1)/CalculateValue

### Request Body
- **Variables** (array) - Required - A list of variables to use for calculation.
    - **ID_Variavel** (integer) - Required - The ID of the variable.
    - **ID_Campo** (integer) - Required - The ID of the field associated with the variable.
    - **Variavel** (string) - Required - The name of the variable.
    - **ValorPadrao** (string) - Required - The default value of the variable.
    - **ID_CampoVariavel** (integer) - Required - The ID linking the field and variable.
    - **Fixo_CampoVariavel** (boolean) - Required - Flag indicating if the link is fixed.
    - **ID_Tabela_CampoVariavel** (integer) - Required - The ID of the table linking field and variable.
    - **ID_Tipo_CampoVariavel** (integer) - Required - The ID of the type of the field-variable link.
    - **VariableId** (integer) - Required - The ID of the variable.
    - **Value** (any) - Required - The value to be used in the calculation.

### Request Example
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

### Headers
- **User-Key** (string) - Required - API key for authentication.
- **Content-Type** (string) - Required - Set to 'application/json'.
```

--------------------------------

TITLE: DELETE /api/Fields@OptionsTables@Options/{id}
DESCRIPTION: Deletes an option from an options table, specified by its unique identifier.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## DELETE /api/Fields@OptionsTables@Options/{id}

### Description
Deletes an option from an options table, identified by its unique ID.

### Method
DELETE

### Endpoint
{{server}}Fields@OptionsTables@Options(182)

### Headers
- **User-Key** (string) - Required - API key for authentication.
- **Content-Type** (string) - Required - Set to 'application/json'.
```

--------------------------------

TITLE: DELETE /api/Fields/{id}
DESCRIPTION: Deletes a field specified by its unique identifier.

SOURCE: https://raw.githubusercontent.com/laviveti/laviploo/refs/heads/dev/docs/ploomes/README

LANGUAGE: APIDOC
CODE:
```
## DELETE /api/Fields/{id}

### Description
Deletes a field identified by its unique ID.

### Method
DELETE

### Endpoint
{{server}}Fields('contact_shit_text')

### Headers
- **User-Key** (string) - Required - API key for authentication.
- **Content-Type** (string) - Required - Set to 'application/json'.
```