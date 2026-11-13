# You can use most Debian-based base images
FROM node:24-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@15.3.3 . --yes

RUN npx --yes shadcn@3.8.5 init --yes -b neutral --force
# An explicit list rather than --all: --all follows the live registry index,
# which can list components this style doesn't serve and then fails the build.
RUN npx --yes shadcn@3.8.5 add --yes \
  accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button \
  button-group calendar card carousel chart checkbox collapsible command \
  context-menu dialog drawer dropdown-menu empty field form hover-card input \
  input-group input-otp item kbd label menubar native-select navigation-menu \
  pagination popover progress radio-group resizable scroll-area select \
  separator sheet sidebar skeleton slider sonner spinner switch table tabs \
  textarea toggle toggle-group tooltip

# Move the Nextjs app to the home directory and remove the nextjs-app directory
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app
