# Auth0 Integration

What are implemented:

- [x] Authentication using [`@auth0/auth0-react`](https://github.com/auth0/auth0-react)
- [x] Authorization using [Role-based access control (RBAC)](https://auth0.com/docs/authorization/rbac) and [Authorization Core](https://auth0.com/docs/authorization/how-to-use-auth0s-core-authorization-feature-set)

  - `Dashboard > Users & Roles` is where to setup the users, roles & permissions

- [x] Universal login
- [x] `api` folder: API authentication and authorization
- [x] `nextjs-app` folder: SSR App to showcase its role & permission feature
- [x] `cra-app` folder: CRA App to showcase its SSO feature

Run each application by going to the app's folder then running the corresponding script for starting that app - don't forget to install the dependencies first! Also, note that the integration is done only in development environment.

---

### Reference

Note that the below article is using [Authorization Extension](https://auth0.com/docs/extensions/authorization-extension) instead of [Authorization Core](https://auth0.com/docs/authorization/how-to-use-auth0s-core-authorization-feature-set) for its RBAC implementation. Read [here](https://auth0.com/docs/authorization/authorization-core-vs-authorization-extension) to know more about the comparison between the two.

- [Architecture Scenarios: SPA + API](https://auth0.com/docs/architecture-scenarios/spa-api)
