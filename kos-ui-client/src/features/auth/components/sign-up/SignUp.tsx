import {
  Button,
  FlexContainer,
  FlexItem,
  Form,
  Heading,
  Input,
  Loading,
} from '@kythera/kui-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useForm } from '../../../../hooks/useForm';
import { useSignUpMutation } from '../../authSlice';

export function SignUp() {
  const { values, handleChange, reset } = useForm({ email: '', password: '' });
  const [signUp, { isLoading }] = useSignUpMutation();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(values)
      .unwrap()
      .then(() => navigate('/'))
      .catch((error) => toast.error(error?.data.errors[0].message));
    reset();
  };

  const renderSignUp = () => {
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
                  Create an account
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
              <Button variant="primary" size="large" type="submit">
                Sign Up
              </Button>
            </FlexContainer>
          </Form>
        </FlexItem>
      </FlexContainer>
    );
  };

  return <div>{renderSignUp()}</div>;
}
