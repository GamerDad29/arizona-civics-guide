export interface IssueContact {
  officialId: string;
  name: string;
  title: string;
  reason: string;
  emailHref: string;
}

export interface Issue {
  id: string;
  label: string;
  icon: string;
  subtitle: string;
  description: string;
  contacts: IssueContact[];
}

export const issues: Issue[] = [
  {
    id: 'housing',
    label: 'Housing',
    icon: 'Home',
    subtitle: 'Zoning, affordability, development',
    description: 'Housing issues involve zoning laws, affordable housing mandates, development permits, and density regulations.',
    contacts: [
      { officialId: 'somers', name: 'Scott Somers', title: 'Mesa City Councilmember D6', reason: 'Controls local zoning and permits', emailHref: 'mailto:scott.somers@mesaaz.gov' },
      { officialId: 'freeman', name: 'Mark Freeman', title: 'Mayor of Mesa', reason: 'Sets city housing policy', emailHref: 'mailto:mayor.freeman@mesaaz.gov' },
      { officialId: 'gallego', name: 'Ruben Gallego', title: 'U.S. Senator', reason: 'Federal housing assistance programs', emailHref: 'mailto:senator_gallego@gallego.senate.gov' },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'BookOpen',
    subtitle: 'Schools, funding, curriculum',
    description: 'Education policy spans school funding, curriculum standards, teacher pay, and charter school oversight.',
    contacts: [
      { officialId: 'tavolacci', name: 'Elaine Tavolacci', title: 'School Board President', reason: 'Direct oversight of Mesa Public Schools', emailHref: 'mailto:board@mpsaz.org' },
      { officialId: 'gallego', name: 'Ruben Gallego', title: 'U.S. Senator', reason: 'Federal education funding (Title I, IDEA)', emailHref: 'mailto:senator_gallego@gallego.senate.gov' },
      { officialId: 'hobbs', name: 'Katie Hobbs', title: 'Governor', reason: 'State education budget authority', emailHref: 'mailto:azgovernor@az.gov' },
    ],
  },
  {
    id: 'transportation',
    label: 'Transportation',
    icon: 'Car',
    subtitle: 'Roads, transit, infrastructure',
    description: 'From local street maintenance to light rail expansion and freeway planning.',
    contacts: [
      { officialId: 'freeman', name: 'Mark Freeman', title: 'Mayor of Mesa', reason: 'City street and transit authority', emailHref: 'mailto:mayor.freeman@mesaaz.gov' },
      { officialId: 'somers', name: 'Scott Somers', title: 'Mesa City Councilmember D6', reason: 'Transportation committee member', emailHref: 'mailto:scott.somers@mesaaz.gov' },
      { officialId: 'stanton', name: 'Greg Stanton', title: 'U.S. Rep CD-4', reason: 'Federal infrastructure funding', emailHref: 'mailto:greg.stanton@mail.house.gov' },
    ],
  },
  {
    id: 'safety',
    label: 'Public Safety',
    icon: 'Shield',
    subtitle: 'Police, fire, emergency services',
    description: 'Covers Mesa PD, Mesa Fire & Medical, and Maricopa County Sheriff jurisdiction.',
    contacts: [
      { officialId: 'freeman', name: 'Mark Freeman', title: 'Mayor of Mesa', reason: 'Oversees Mesa PD and Fire', emailHref: 'mailto:mayor.freeman@mesaaz.gov' },
      { officialId: 'skinner', name: 'Russ Skinner', title: 'Maricopa County Sheriff', reason: 'Sheriff jurisdiction in unincorporated areas', emailHref: 'mailto:sheriff@mcso.maricopa.gov' },
      { officialId: 'somers', name: 'Scott Somers', title: 'Mesa City Councilmember D6', reason: 'Public Safety committee assignment', emailHref: 'mailto:scott.somers@mesaaz.gov' },
    ],
  },
  {
    id: 'environment',
    label: 'Environment',
    icon: 'Trees',
    subtitle: 'Water, air quality, parks',
    description: 'Arizona water scarcity, CAP water rights, urban heat mitigation, and park maintenance.',
    contacts: [
      { officialId: 'kelly', name: 'Mark Kelly', title: 'U.S. Senator', reason: 'Water infrastructure legislation champion', emailHref: 'mailto:senator_kelly@kelly.senate.gov' },
      { officialId: 'hobbs', name: 'Katie Hobbs', title: 'Governor', reason: 'State water policy authority', emailHref: 'mailto:azgovernor@az.gov' },
      { officialId: 'freeman', name: 'Mark Freeman', title: 'Mayor of Mesa', reason: 'City parks and utilities', emailHref: 'mailto:mayor.freeman@mesaaz.gov' },
    ],
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    icon: 'Heart',
    subtitle: 'Access, affordability, services',
    description: 'Medicaid (AHCCCS), hospital funding, mental health resources, and insurance regulation.',
    contacts: [
      { officialId: 'gallego', name: 'Ruben Gallego', title: 'U.S. Senator', reason: 'ACA and federal healthcare legislation', emailHref: 'mailto:senator_gallego@gallego.senate.gov' },
      { officialId: 'kelly', name: 'Mark Kelly', title: 'U.S. Senator', reason: 'Veterans and Medicare legislation', emailHref: 'mailto:senator_kelly@kelly.senate.gov' },
      { officialId: 'hobbs', name: 'Katie Hobbs', title: 'Governor', reason: 'State Medicaid and mental health budget', emailHref: 'mailto:azgovernor@az.gov' },
    ],
  },
  {
    id: 'economy',
    label: 'Economy / Jobs',
    icon: 'Briefcase',
    subtitle: 'Business, employment, development',
    description: 'Economic development, business incentives, workforce training, and commercial zoning.',
    contacts: [
      { officialId: 'freeman', name: 'Mark Freeman', title: 'Mayor of Mesa', reason: 'Mesa economic development authority', emailHref: 'mailto:mayor.freeman@mesaaz.gov' },
      { officialId: 'hobbs', name: 'Katie Hobbs', title: 'Governor', reason: 'State economic policy and incentives', emailHref: 'mailto:azgovernor@az.gov' },
      { officialId: 'stanton', name: 'Greg Stanton', title: 'U.S. Rep CD-4', reason: 'Federal business and workforce programs', emailHref: 'mailto:greg.stanton@mail.house.gov' },
    ],
  },
  {
    id: 'immigration',
    label: 'Immigration',
    icon: 'Globe',
    subtitle: 'Border, policy, enforcement',
    description: 'Border security, immigration enforcement, asylum policy, and refugee services.',
    contacts: [
      { officialId: 'gallego', name: 'Ruben Gallego', title: 'U.S. Senator', reason: 'Border and immigration legislation', emailHref: 'mailto:senator_gallego@gallego.senate.gov' },
      { officialId: 'kelly', name: 'Mark Kelly', title: 'U.S. Senator', reason: 'Bipartisan border security focus', emailHref: 'mailto:senator_kelly@kelly.senate.gov' },
      { officialId: 'biggs', name: 'Andy Biggs', title: 'U.S. Rep CD-5', reason: 'Border security and enforcement focus', emailHref: 'mailto:andy.biggs@mail.house.gov' },
    ],
  },
];
