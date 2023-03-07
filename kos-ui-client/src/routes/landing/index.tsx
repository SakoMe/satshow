import {
  Figure,
  FlexContainer,
  GridContainer,
  Image,
  Section,
  theme,
} from '@kythera/kui-components';

import background from '../../assets/images/landing_bg.svg';
import logo from '../../assets/images/logo.svg';
import { SignIn } from '../../features/auth/components';

export function Landing() {
  return (
    <GridContainer gridTemplateColumns="repeat(2, 1fr)" width="100vw" height="100vh">
      <Section
        width="60vw"
        height="100vh"
        style={{ backgroundImage: `url(${background})` }}
      >
        <Figure position="absolute" top="45%" left="20%">
          <Image src={logo} alt="KOS logo" />
        </Figure>
      </Section>
      <Section width="40vw" height="100vh" backgroundColor={theme.colors.greyScale[300]}>
        <FlexContainer alignItems="center" justifyContent="center" height="100vh">
          <SignIn />
        </FlexContainer>
      </Section>
    </GridContainer>
  );
}
