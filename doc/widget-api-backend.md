## Abstract

In the previous year Contentful enhanced the editing experience on its UI by adding widgets to the platform. Users had then the chance to customize the appearance and behaviour of a field by choosing which widget would be applied to it. Until now widgets, a combination of JS, HTML and CSS, have been developed in-house which meant that we had a well maintained but quite small widget ecosystem.

As part of the goals for this quarter, the DevExp Team has to enhance the widget system making it possible for third party developers to create and use new widgets. Making this happen is a task that involves both the frontend and the backend. The backend members of the team will have to extend the Contentful API to add support for creation, update, deletion and read of widgets. 

## Description
The Content Management will be extended to accommodate the new endpoints required to manage the Widgets.

### API

#### Endpoints
Path | Method| Payload | Description | Notes
-----|-------|---------|-------------|------
spaces/XYZ/widgets | GET|	None | Returns the widgets for the space.| The returned payload will have the same structure as other collections
spaces/XYZ/widgets |	POST | A json object |Creates a widget  
spaces/XYZ/widgets/ABC | PUT	| A json object | If the widget with ID ABC doesn't already exists it will be created with that ID. If the widget already exists the payload will replace the current widget with that ID. 
spaces/XYZ/widgets/ABC | DELETE	| None | Deletes the widget with ID ABC 
spaces/XYZ/widgets/ABC | GET | None | Returns the widget with ID ABC |	 
#### Querying
To be discussed

#### Restrictions
For the prototype there should be no limitations to the data apart of those enforced by the storage mechanism. We might want to rethink this after we evaluated performance, requirements, and upsell needs.

#### Validation
For now it suffices to assure that the payload is a JSON document. In the future we will have the following validations:

Name | Type | Required | Validation
-----|------|----------|-----------
src | String |	❌ (yes if no srcdoc given) 
srcdoc |	String |	❌ (yes if no src given)
fieldTypes | Array of strings | ❌ | Every element must be one of the strings Symbol, Symbols, Text, Integer, Number, Date, Boolean, Object, Entry, Entries, Asset, Assets
name | String | ✓
 
#### Widget schema
A widget is a JSON object with at least the following properties. For the prototype the endpoint should accept and store any additional properties

Name | Type | Description
-----|------|------------
src | String |	Should be a URL that points to the HTML document displayed in
srcdoc | String | An HTML document serialized as a string. This will be theset as the srcdoc attribute on the widget IFrame.
fieldTypes | Array of strings	 | Field Types the widget can be used
name | String | The string that is displayed when selecting the widget in the CT Editor

#### Access Control
For the prototype we consider the following access control rules:

- Only the developer role must be able to create and update a widget resource.
- Every user who has access to a space can read all widgets
