import {
  Button,
  CheckBox,
  FlexContainer,
  FlexItem,
  Form,
  Heading,
  Input,
  Loading,
  Text,
} from '@kythera/kui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useForm } from '../../../../hooks/useForm';
import { useSignInMutation } from '../../authSlice';

export function SignIn() {
  const [checked, setChecked] = useState(false);
  const { values, handleChange, reset } = useForm({ email: '', password: '' });
  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(values)
      .unwrap()
      .then(() => navigate('/home'))
      .catch((error) => {
        toast.error(error?.data?.errors.at(0)?.message ?? 'Login Error');
      });
    reset();
  };

  const renderSignIn = () => {
    if (isLoading) {
      return <Loading />;
    }

    return (
      <FlexContainer flexDirection="column" alignItems="center" justifyContent="center">
        <FlexItem>
          <Form onSubmit={handleSubmit}>
            <FlexContainer flexDirection="column">
              <FlexItem>
                <Heading variant="T7" weight="bold">
                  Welcome to PROS!
                </Heading>
              </FlexItem>
              <FlexItem marginBottom="2rem" marginTop="1rem">
                <Heading variant="T5" weight="medium">
                  Experience the future of SATCOM
                </Heading>
              </FlexItem>
              <FlexItem marginBottom="1rem">
                <Input
                  width="100%"
                  backgroundImage="https://bit.ly/3eFWcEw"
                  backgroundPosition="0.5rem 50%"
                  backgroundSize="1.5rem"
                  textIndent="1.5rem"
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                />
              </FlexItem>
              <FlexItem marginBottom="1rem">
                <Input
                  width="100%"
                  backgroundImage="https://bit.ly/3yPlgj7"
                  backgroundPosition="0.5rem 50%"
                  backgroundSize="1.5rem"
                  textIndent="1.5rem"
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                />
              </FlexItem>
              <FlexContainer alignItems="center" marginBottom="1rem">
                <FlexItem>
                  <CheckBox
                    isChecked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                </FlexItem>
                <FlexItem marginLeft="1rem">
                  <Text variant="T1" weight="regular" tag="action">
                    Remember me
                  </Text>
                </FlexItem>
              </FlexContainer>
              <Button variant="primary" size="large" type="submit">
                Sign In
              </Button>
            </FlexContainer>
          </Form>
        </FlexItem>
      </FlexContainer>
    );
  };

  return <div>{renderSignIn()}</div>;
}
