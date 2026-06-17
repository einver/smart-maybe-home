FROM ://microsoft.com AS build
WORKDIR /src
COPY ["SmartHome.csproj", "./"]
RUN dotnet restore "./SmartHome.csproj"
COPY . .
RUN dotnet publish "./SmartHome.csproj" -c Release -o /app/publish


FROM ://microsoft.com AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SmartHome.dll"]
