import { useSelector } from 'react-redux';
import * as AllNavigation from 'src/utils/routes';
import * as AllPages from 'src/pages';
import { UserRoles } from 'src/utils/enum';

export const openRouteList = [
  {
    key: 'login-route',
    component: AllPages.Login,
    path: AllNavigation.LOGIN,
    props: { newAccount: false },
  },
  {
    key: 'register-route',
    component: AllPages.Login,
    path: AllNavigation.NEW_ACCOUNT,
    props: { newAccount: true },
  },
  {
    key: 'verify-email',
    component: AllPages.VerfiyEmail,
    path: AllNavigation.VERIFY_EMAIL,
  },
]

export const routeLists = [
  {
    key: 'root',
    component: AllPages.Dashboard,
    path: AllNavigation.ROOT,
  },
  {
    key: 'property',
    component: AllPages.AddProperty,
    path: AllNavigation.ADD_PROPERTY,
  },
  {
    key: 'property-verifications',
    component: AllPages.PropertyVerificationRequests,
    path: AllNavigation.PROPERTY_VERIFICATION_REQUESTS,
  },
  {
    key: 'about',
    component: AllPages.AboutUs,
    path: AllNavigation.ABOUT_US,
  },
  {
    key: 'search-properties',
    component: AllPages.SearchProperties,
    path: AllNavigation.SEARCH_PROPERTIES,
  },
  {
    key: 'wishlist',
    component: AllPages.Wishlist,
    path: AllNavigation.WISHLIST,
  },
  {
    key: 'property-details',
    component: AllPages.PropertyDetails,
    path: AllNavigation.PROPERTY_DETAILS,
  },
]
